import BaseScene from '@/phaser/common/BaseScene'
import Card from '@/models/common/Card'
// eslint-disable-next-line
import House from '@/models/blackjack/House'
import BlackjackTable from '@/models/blackjack/BlackjackTable'
import TableView from '@/phaser/blackjack/TableView'
import PlayerView from '@/phaser/blackjack/PlayerView'
import HouseView from '@/phaser/blackjack/HouseView'
import PlayerTypes from '@/types/common/player-types'
import { GameTypes } from '@/types/common/game-types'
import { GamePhases } from '@/types/common/game-phase-types'
import { delay } from '@/utils/utils'
import BlackjackPlayer from '@/models/blackjack/BlackjackPlayer'

export default class BlackjackScene extends BaseScene {
  private readonly _tableModel: BlackjackTable

  private _tableView: TableView | undefined

  private _playerViews: PlayerView[] = []

  private _houseView: HouseView[] = []

  constructor() {
    super('BlackjackScene')

    this._tableModel = new BlackjackTable(GameTypes.Blackjack)
  }

  async create(): Promise<void> {
    super.create()

    this._tableView = new TableView(this, this._tableModel)
    this._playerViews = this._tableView.playerViews
    this._houseView = this._tableView.houseView

    this.startGame()
  }

  // eslint-disable-next-line
  protected async startGame(): Promise<void> {
    await this.bettingProcess()
    await this.actingProcess()
    await this.evaluatingProcess()
    await this.settlementProcess()
    await this.prepareNextGame()
  }

  private static async waitForCompletion(
    condition: () => boolean
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      const checkCompletion = () => {
        if (condition()) {
          resolve()
        } else {
          setTimeout(checkCompletion, BlackjackScene.DELAY_TIME)
        }
      }

      checkCompletion()
    })
  }

  private async bettingProcess(): Promise<void> {
    this.decideAiPlayersBetAmount()
    this.createBetButtons()
    this._tableView?.getUserBetInfo()
  }

  private async actingProcess(): Promise<void> {
    await BlackjackScene.waitForCompletion(
      () => this._tableModel.userBetCompleted
    )

    this._tableModel.gamePhase = GamePhases.Acting

    await this.dealCardsToParticipants()
    await delay(BlackjackScene.DELAY_TIME)
    this.revealAllHand()

    this._tableModel.setPlayersStatus()
    this._tableModel.setHouseStatus()
    this.updatePlayersStatus()
    this.updatePlayersScore()

    await delay(BlackjackScene.DELAY_TIME)
    this.createActionButtons()
    await this._tableView?.getUserAction()
    await this.aiProcess()
    await this.houseProcess()
  }

  private async evaluatingProcess(): Promise<void> {
    await BlackjackScene.waitForCompletion(() =>
      this._tableModel.houseActionCompleted()
    )

    this._tableModel.gamePhase = GamePhases.Evaluating
    this._tableModel.evaluatingPlayers()

    this.updatePlayersGameResult()
    await delay(BlackjackScene.DELAY_TIME * 3)
    this.removePlayersGameResult()
  }

  private async settlementProcess(): Promise<void> {
    await BlackjackScene.waitForCompletion(
      () => this._tableModel.evaluateCompleted
    )

    this._tableModel.gamePhase = GamePhases.Settlement
    this._tableModel.settlementPlayers()

    this.updatePlayersChips()
    this.updatePlayersBet()
  }

  // eslint-disable-next-line
  protected async prepareNextGame(): Promise<void> {
    await BlackjackScene.waitForCompletion(
      () => this._tableModel.settlementCompleted
    )
    const houseView: HouseView = this.getHouseView()

    this._tableModel.prepareNextRound()
    this.updatePlayersStatus()
    this.updatePlayersScore()
    this.resetBlackjackPlayerColor()
    houseView.updateStatus()
    houseView.updateScore()
    this.removePlayersCards()
    houseView.removeAllCards()

    await delay(BlackjackScene.DELAY_TIME * 3)

    this.startGame()
  }

  private decideAiPlayersBetAmount(): void {
    this._tableModel.decideAiPlayersBetAmount()

    this.updatePlayersBet()
    this.updatePlayersChips()
  }

  private async dealCardsToParticipants(): Promise<void> {
    const totalPlayers: number = this._tableModel.players.length

    for (let times: number = 0; times < 2; times += 1) {
      let currentIndex: number = 0

      for (let i: number = 0; i < totalPlayers; i += 1) {
        const currentPlayerView: PlayerView = this._playerViews[currentIndex]

        if (!currentPlayerView.playerModel.isBroken()) {
          const card: Card = this._tableModel.drawCard()
          currentPlayerView.playerModel.addHand(card)

          // eslint-disable-next-line
          await delay(BlackjackScene.DELAY_TIME / 10)
          currentPlayerView.animateAddHand(
            this._tableView!.deckView.x,
            this._tableView!.deckView.y - 14,
            card,
            times
          )
          currentIndex = (currentIndex + 1) % totalPlayers
        }
        // houseの手札追加
        if (i >= totalPlayers - 1) {
          const houseView: HouseView = this.getHouseView()
          const houseCard: Card = this._tableModel.drawCard()
          houseView.houseModel.addHand(houseCard)

          // eslint-disable-next-line
          await delay(BlackjackScene.DELAY_TIME / 10)
          houseView.animateAddHand(
            this._tableView!.deckView.x,
            this._tableView!.deckView.y - 14,
            houseCard,
            times
          )
        }
      }
    }
  }

  private revealAllHand(): void {
    this.revealUserHand()
    this.revealBotHand()
    this.revealHouseFirstHand()
  }

  private revealUserHand(): void {
    const user: PlayerView = this._playerViews.filter(
      (player: PlayerView) =>
        player.playerModel.playerType === PlayerTypes.Player
    )[0]
    user.revealHand()
  }

  private revealBotHand(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      if (playerView.playerModel.playerType === PlayerTypes.Ai)
        playerView.revealHand()
    })
  }

  private revealHouseFirstHand(): void {
    const houseView: HouseView = this.getHouseView()
    houseView.revealFirstHand()
  }

  private removePlayersCards(): void {
    this._playerViews.forEach((playerView: PlayerView) =>
      playerView.removeAllCards()
    )
  }

  private removePlayersGameResult(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      playerView.removeGameResult()
    })
  }

  private updatePlayersGameResult(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      playerView.updateGameResult()
    })
  }

  private updatePlayersStatus(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      if (playerView.playerModel.isBlackjack())
        playerView.updateBlackjackColor()
      playerView.updateStatus()
    })
  }

  private updatePlayersScore(): void {
    this._playerViews.forEach((playerView) => {
      playerView.updateScore()
    })
  }

  private updatePlayersChips(): void {
    this._playerViews.forEach((playerView) => {
      playerView.updateChips()
    })
  }

  private updatePlayersBet(): void {
    this._playerViews.forEach((playerView) => {
      playerView.updateBet()
    })
  }

  private resetBlackjackPlayerColor(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      playerView.resetBlackjackColor()
    })
  }

  private createBetButtons(): void {
    const userView: PlayerView | undefined = this._playerViews.filter(
      (playerView: PlayerView) =>
        playerView.playerModel.playerType === PlayerTypes.Player
    )[0]
    const { betDenominations } = this._tableModel

    betDenominations.forEach((number: number, index: number) => {
      this._tableView?.displayButtons(
        userView,
        String(number),
        index - 1.5,
        'bet'
      )
    })

    this._tableView?.displayButtons(
      userView,
      'ALL',
      betDenominations.length - 1.5,
      'bet'
    )
    this._tableView?.displayButtons(
      userView,
      'RESET',
      betDenominations.length - 0.5,
      'bet'
    )
    this._tableView?.displayButtons(
      userView,
      'OK',
      betDenominations.length + 0.5,
      'bet'
    )
  }

  private createActionButtons(): void {
    const userView: PlayerView | undefined = this._playerViews.filter(
      (playerView: PlayerView) =>
        playerView.playerModel.playerType === PlayerTypes.Player
    )[0]

    if (!userView.playerModel.isBlackjack()) {
      this._tableView?.displayButtons(userView, 'STAND', 0, 'action')
      this._tableView?.displayButtons(userView, 'HIT', 1, 'action')
      this._tableView?.displayButtons(userView, 'DOUBLE', 2, 'action')
      this._tableView?.displayButtons(userView, 'SURRENDER', 3, 'action')
    }
  }

  private getAiPlayersView(): PlayerView[] {
    return this._playerViews.filter(
      (playerView: PlayerView) =>
        playerView.playerModel.playerType === PlayerTypes.Ai
    )
  }

  private getHouseView(): HouseView {
    return this._houseView[0]
  }

  private async aiProcess(): Promise<void> {
    const aiPlayerViews: PlayerView[] = this.getAiPlayersView()

    // eslint-disable-next-line
    for (const aiPlayerView of aiPlayerViews) {
      const aiPlayerModel: BlackjackPlayer = aiPlayerView.playerModel
      if (!aiPlayerModel.isBroken()) {
        while (aiPlayerModel.getHandTotalScore() < 17) {
          // eslint-disable-next-line
          await delay(BlackjackScene.DELAY_TIME * 2)

          const card: Card = this._tableModel.drawCard()
          aiPlayerModel.addHand(card)
          aiPlayerView.animateAddHand(
            this._tableView!.deckView.x,
            this._tableView!.deckView.y - 14,
            card,
            aiPlayerModel.hand.cards.length - 1
          )
          aiPlayerView.revealLastHand()

          if (aiPlayerModel.getHandTotalScore() > 21) {
            aiPlayerModel.bust()
            aiPlayerView.updateStatus()
          } else if (aiPlayerModel.getHandTotalScore() >= 17) {
            aiPlayerModel.stand()
            aiPlayerView.updateStatus()
          }

          aiPlayerView.updateScore()
        }
      }
    }
  }

  private async houseProcess(): Promise<void> {
    await BlackjackScene.waitForCompletion(() => this._tableModel.isHouseTurn())
    await delay(BlackjackScene.DELAY_TIME)

    const houseView: HouseView = this.getHouseView()

    houseView.revealLastHand()
    houseView.updateStatus()
    houseView.updateScore()

    const { houseModel } = houseView
    if (houseModel.isBlackjack()) {
      houseView.updateBlackjackColor()
    } else {
      while (houseModel.getHandTotalScore() < 17) {
        // eslint-disable-next-line
        await delay(BlackjackScene.DELAY_TIME * 2)

        const card: Card = this._tableModel.drawCard()
        houseModel.addHand(card)
        houseView.animateAddHand(
          this._tableView!.deckView.x,
          this._tableView!.deckView.y - 14,
          card,
          houseModel.hand.cards.length - 1
        )
        houseView.revealLastHand()

        if (houseModel.getHandTotalScore() > 21) {
          houseModel.bust()
          houseView.updateStatus()
        } else if (houseModel.getHandTotalScore() >= 17) {
          houseModel.stand()
          houseView.updateStatus()
        }

        houseView.updateScore()
      }
    }
  }
}
