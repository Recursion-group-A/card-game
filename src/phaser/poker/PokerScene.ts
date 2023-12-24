import BaseScene from '@/phaser/common/BaseScene'
import Card from '@/models/common/Card'
import PlayerView from '@/phaser/poker/PlayerView'
import PokerTable from '@/models/poker/PokerTable'
import TableView from '@/phaser/poker/TableView'
import BotDecisionMaker from '@/models/poker/BotDecisionMaker'
import PokerHandEvaluator from '@/models/poker/PokerHandEvaluator'
import PokerHand from '@/types/poker/PokerHand'
import PokerRound from '@/types/poker/PokerRound'
import PokerAction from '@/types/poker/PokerAction'
import PLAYERTYPES from '@/types/common/playerTypes'
import { GAMETYPE } from '@/types/common/gameTypes'
import { delay } from '@/utils/utils'

export default class PokerScene extends BaseScene {
  private static readonly DELAY_TIME: number = 1500

  private readonly _tableModel: PokerTable

  private _tableView: TableView | undefined

  private _playerViews: PlayerView[] = []

  private readonly _decisionMaker: BotDecisionMaker

  private readonly _isGameActive: boolean

  private _isWalk: boolean

  constructor() {
    super('PokerScene')

    this._tableModel = new PokerTable(GAMETYPE.Poker)
    this._decisionMaker = new BotDecisionMaker(this._tableModel)
    this._isGameActive = true
    this._isWalk = false
  }

  async create(): Promise<void> {
    super.create()

    this._tableView = new TableView(this, this._tableModel)
    this._playerViews = this._tableView.playerViews
    await this.startGameLoop()
  }

  update(): void {
    this._tableView?.update()
  }

  private async startGameLoop(): Promise<void> {
    while (this._isGameActive) {
      await this.startGame() // eslint-disable-line
    }
  }

  private async startGame(): Promise<void> {
    await this.processBeforePreFlop()
    await this.processAllRounds()
    await this.showDown()
    await this.prepareNextGame()
  }

  private async processBeforePreFlop(): Promise<void> {
    this.assignDealerButton()
    await delay(PokerScene.DELAY_TIME)
    await this.collectBlinds()
    await delay(PokerScene.DELAY_TIME)
    await this.dealCardsToPlayers()
    await delay(PokerScene.DELAY_TIME)
    this._tableView?.revealUserHand()
  }

  private assignDealerButton(): void {
    if (this._tableModel.isFirstTime) {
      this._tableModel.assignInitialDealer()
      this._tableModel.assignOtherPlayersPosition()
      this._tableModel.isFirstTime = false
    }
    this._tableView?.assignDealerButton()
  }

  private async collectBlinds(): Promise<void> {
    this.collectIndividualBlind(
      this._tableModel.sbIndex,
      this._tableModel.smallBlind
    )

    await delay(PokerScene.DELAY_TIME / 2)

    this.collectIndividualBlind(
      this._tableModel.bbIndex,
      this._tableModel.bigBlind
    )
  }

  private collectIndividualBlind(index: number, amount: number): void {
    this._tableModel.collectBlind(index, amount)
    this._playerViews[index].animatePlaceBet()
  }

  private async dealCardsToPlayers(): Promise<void> {
    const totalPlayers: number = this._tableModel.players.length

    for (let times: number = 0; times < 2; times += 1) {
      let currentIndex: number = this._tableModel.sbIndex

      for (let i: number = 0; i < totalPlayers; i += 1) {
        const currentPlayerView: PlayerView = this._playerViews[currentIndex]
        const card: Card = this._tableModel.drawCard()
        currentPlayerView.playerModel.addHand(card)

        // eslint-disable-next-line
        await delay(PokerScene.DELAY_TIME / 10)
        currentPlayerView.animateAddHand(
          this._tableView!.deckView.x,
          this._tableView!.deckView.y - 14,
          card,
          times
        )
        currentIndex = (currentIndex + 1) % totalPlayers
      }
    }
  }

  private async processAllRounds(): Promise<void> {
    await this.processRound(PokerRound.PreFlop, this._tableModel.utgIndex, 3)
    await this.processRound(PokerRound.Flop, this._tableModel.sbIndex, 1)
    await this.processRound(PokerRound.Turn, this._tableModel.sbIndex, 1)
    await this.processRound(PokerRound.River, this._tableModel.sbIndex, 0)
  }

  private async processRound(
    round: PokerRound,
    startIndex: number,
    cardsToAdd: number
  ): Promise<void> {
    if (this._isWalk) return

    this._tableModel.round = round
    await delay(PokerScene.DELAY_TIME)
    await this.startRound(startIndex)
    await delay(PokerScene.DELAY_TIME)
    if (cardsToAdd > 0 && !this._isWalk) {
      await this._tableView?.dealCommunityCards(cardsToAdd)
    }
  }

  private async startRound(startIndex: number): Promise<void> {
    let index: number = startIndex
    let actionCompleted: number = 0

    while (actionCompleted < this._tableModel.players.length) {
      const currentPlayer: PlayerView = this._playerViews[index]

      if (currentPlayer.playerModel.isActive) {
        // eslint-disable-next-line
        await this.processPlayerAction(currentPlayer)

        if (this.checkForSingleActivePlayer()) {
          this._isWalk = true
          break
        }

        if (currentPlayer.playerModel.lastAction === PokerAction.RAISE) {
          actionCompleted = 0
        }
      }
      index = (index + 1) % this._tableModel.players.length
      actionCompleted += 1
    }
  }

  private checkForSingleActivePlayer(): boolean {
    return this.getActivePlayers().length === 1
  }

  private getActivePlayers(): PlayerView[] {
    return this._playerViews.filter(
      (player: PlayerView) => player.playerModel.isActive
    )
  }

  private async processPlayerAction(playerView: PlayerView): Promise<void> {
    await delay(PokerScene.DELAY_TIME / 2)

    if (playerView.playerModel.playerType === PLAYERTYPES.PLAYER) {
      const tableView = this._tableView
      if (tableView) {
        tableView.displayActionButtons(playerView)
        const action: PokerAction | undefined = await tableView.getUserAction()
        if (action) {
          this.handleAction(playerView, action)
        }
      }
    } else {
      let action: PokerAction = this._decisionMaker.determineAIAction(
        playerView.playerModel
      )
      if (
        action === PokerAction.CALL &&
        this._tableModel.currentMaxBet === playerView.playerModel.bet
      ) {
        action = PokerAction.CHECK
      }
      this.handleAction(playerView, action)
    }
  }

  private handleAction(player: PlayerView, action: PokerAction): void {
    this._tableModel.handleAction(player.playerModel, action)
    this._tableView?.executeActionEffect(player, action)
    this._tableView?.setVisibleActionButtons(false)
  }

  private async showDown(): Promise<void> {
    this._tableModel.round = PokerRound.Showdown

    if (this._isWalk) {
      this.handleWalk()
      return
    }

    const communityCard: Card[] = this._tableModel.communityCards.cards
    this._playerViews.forEach((player: PlayerView) => {
      if (player.playerModel.isActive) {
        this.processPlayerShowdown(player, communityCard)
      }
    })
    const winners: PlayerView[] = this.findWinners()
    const winAmountPerPlayer: number = Math.floor(
      this._tableModel.pot.getTotalPot() / winners.length
    )
    this._tableView?.distributeWinnings(winners, winAmountPerPlayer)
  }

  // eslint-disable-next-line
  private processPlayerShowdown(
    player: PlayerView,
    communityCard: Card[]
  ): void {
    player.revealHand()
    // eslint-disable-next-line
    player.playerModel.bestHand = PokerHandEvaluator.evaluateHand(
      player.playerModel.hand.cards,
      communityCard
    )
  }

  private findWinners(): PlayerView[] {
    let bestHand: PokerHand = PokerHand.HighCard
    let winners: PlayerView[] = []

    this._playerViews.forEach((player: PlayerView) => {
      const playerBestHand: PokerHand | undefined = player.playerModel.bestHand
      if (playerBestHand) {
        if (playerBestHand > bestHand) {
          bestHand = playerBestHand
          winners = [player]
        } else if (playerBestHand === bestHand) {
          winners.push(player)
        }
      }
    })
    return winners
  }

  private handleWalk(): void {
    const winner: PlayerView[] = this.getActivePlayers()
    const winAmount: number = this._tableModel.pot.getTotalPot()
    this._tableView?.distributeWinnings(winner, winAmount)
  }

  private async prepareNextGame(): Promise<void> {
    this._tableModel.resetGame()
    this._tableView?.displayPromptText()
    await this._tableView?.waitForUserClick()
    this._tableView?.resetTableAndView()
    this._isWalk = false
  }
}
