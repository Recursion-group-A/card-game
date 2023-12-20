import Phaser from 'phaser'
import Card from '@/models/common/Card'
import CardView from '@/phaser/common/CardView'
import Deck from '@/models/common/Deck'
import DeckView from '@/phaser/common/DeckView'
import Player from '@/models/poker/Player'
import PlayerView from '@/phaser/poker/PlayerView'
import Table from '@/models/poker/Table'
import { GAMETYPE } from '@/types/gameTypes'
import PLAYERTYPES from '@/types/playerTypes'
import PokerHand from '@/models/poker/PokerHand'
import PokerHandEvaluator from '@/models/poker/PokerHandEvaluator'
import PokerAction from '@/models/poker/PokerAction'
import PokerRound from '@/models/poker/rounds'
import { delay } from '@/utils/utils'
import BotDecisionMaker from '@/models/poker/BotDecisionMaker'

export default class TableView extends Phaser.GameObjects.Container {
  private static readonly DELAY_TIME: number = 1500

  private readonly _sceneWidth: number = this.scene.cameras.main.width

  private readonly _sceneHeight: number = this.scene.cameras.main.height

  private readonly _tableModel: Table

  private readonly _playerViews: PlayerView[] = []

  private readonly _decisionMaker: BotDecisionMaker

  private readonly _deckView: DeckView

  private readonly _potTotalText: Phaser.GameObjects.Text

  private readonly _promptText: Phaser.GameObjects.Text

  private readonly _communityCards: Phaser.GameObjects.Container

  private readonly _actionButtons: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene, gameType: GAMETYPE) {
    super(scene)
    this._tableModel = new Table(gameType)
    this._decisionMaker = new BotDecisionMaker(this._tableModel)
    this._deckView = new DeckView(
      this.scene,
      this._sceneWidth / 2 + 150,
      this._sceneHeight / 2,
      new Deck(gameType)
    )
    this._potTotalText = this.scene.add.text(
      this._sceneWidth / 2 - 40,
      this._sceneHeight / 2 - 85,
      `POT: $${this._tableModel.pot.getTotalPot()}`,
      { font: '18px' }
    )
    this._promptText = this.scene.add
      .text(
        this._sceneWidth / 2 - 130,
        this._sceneHeight / 2 + 65,
        '(Press anywhere to continue)'
      )
      .setVisible(false)
    this._communityCards = this.scene.add.container()
    this._actionButtons = this.scene.add.container()

    this.add([
      this._deckView,
      this._communityCards,
      this._potTotalText,
      this._actionButtons,
      this._promptText
    ])

    const playersPos: { x: number; y: number }[] = [
      { x: 750, y: 100 },
      { x: 750, y: 350 },
      { x: 455, y: 550 }, // プレイヤー
      { x: 150, y: 350 },
      { x: 150, y: 100 },
      { x: 450, y: 100 }
    ]

    this._tableModel.players.forEach((player: Player, index: number) => {
      const playerView: PlayerView = new PlayerView(
        this.scene,
        player,
        playersPos[index]
      )
      this._playerViews.push(playerView)
      this.add(playerView)
    })

    scene.add.existing(this)
  }

  update() {
    this._potTotalText.setText(`POT: $${this._tableModel.pot.getTotalPot()}`)
  }

  public async startGame(): Promise<void> {
    await this.processBeforePreFlop()
    await this.processAllRounds()
    await this.showDown()
    await this.prepareNextGame()
  }

  private async processBeforePreFlop(): Promise<void> {
    this.assignDealerBtn()
    await delay(TableView.DELAY_TIME)
    await this.animateCollectBlinds()
    await delay(TableView.DELAY_TIME)
    await this.animateDealCardToPlayers()
    await delay(TableView.DELAY_TIME)
    this.revealUserHand()
  }

  private assignDealerBtn(): void {
    if (this._tableModel.isFirstTime) {
      this._tableModel.assignInitialDealer()
      this._tableModel.assignOtherPlayersPosition()
      this._tableModel.isFirstTime = false
    }

    this._playerViews.forEach((player: PlayerView) => {
      player.removeDealerBtn()
    })

    const dealer: PlayerView = this._playerViews[this._tableModel.dealerIndex]
    dealer.addDealerBtn()
  }

  private async animateCollectBlinds(): Promise<void> {
    this._tableModel.collectBlind(
      this._tableModel.sbIndex,
      this._tableModel.smallBlind
    )
    const sbPlayer: PlayerView = this._playerViews[this._tableModel.sbIndex]
    sbPlayer.animatePlaceBet()

    await delay(TableView.DELAY_TIME / 2)

    this._tableModel.collectBlind(
      this._tableModel.bbIndex,
      this._tableModel.bigBlind
    )
    const bbPlayer: PlayerView = this._playerViews[this._tableModel.bbIndex]
    bbPlayer.animatePlaceBet()
  }

  private async animateDealCardToPlayers(): Promise<void> {
    const totalPlayers: number = this._tableModel.players.length

    for (let times: number = 0; times < 2; times += 1) {
      let currentIndex: number = this._tableModel.sbIndex

      for (let i: number = 0; i < totalPlayers; i += 1) {
        const currentPlayerView: PlayerView = this._playerViews[currentIndex]
        const card: Card = this._tableModel.drawValidCardFromDeck()
        currentPlayerView.playerModel.addHand(card)

        await delay(TableView.DELAY_TIME / 10) // eslint-disable-line
        currentPlayerView.animateAddHand(
          this._deckView.x,
          this._deckView.y - 14,
          card,
          times
        )
        currentIndex = (currentIndex + 1) % totalPlayers
      }
    }
  }

  private revealUserHand(): void {
    const user: PlayerView = this._playerViews.filter(
      (player: PlayerView) =>
        player.playerModel.playerType === PLAYERTYPES.PLAYER
    )[0]
    user.revealHand()
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
    await delay(TableView.DELAY_TIME)
    this._tableModel.round = round
    await this.startRound(startIndex, cardsToAdd)
  }

  private async startRound(
    startIndex: number,
    cardsToAdd: number
  ): Promise<void> {
    let index: number = startIndex
    let actionCompleted: number = 0

    while (actionCompleted < this._tableModel.players.length) {
      const currentPlayer: PlayerView = this._playerViews[index]
      const currentPlayerModel: Player = currentPlayer.playerModel

      if (currentPlayerModel.isActive) {
        // eslint-disable-next-line
        await this.processPlayerAction(currentPlayerModel, currentPlayer)

        if (currentPlayerModel.lastAction === PokerAction.RAISE) {
          actionCompleted = 0
        }
      }
      index = (index + 1) % this._tableModel.players.length
      actionCompleted += 1
    }

    await delay(TableView.DELAY_TIME)
    if (cardsToAdd > 0) {
      await this.dealCommunityCards(cardsToAdd)
    }
  }

  private async processPlayerAction(
    playerModel: Player,
    playerView: PlayerView
  ): Promise<void> {
    await delay(600)

    if (playerModel.playerType === PLAYERTYPES.PLAYER) {
      this.showActionButtons(playerView.x, playerView.y, playerModel)
      const action: PokerAction = await this.getUserAction()
      this.handleAction(playerView, action)
    } else {
      let action: PokerAction =
        this._decisionMaker.determineAIAction(playerModel)
      if (
        action === PokerAction.CALL &&
        this._tableModel.currentMaxBet === playerModel.bet
      ) {
        action = PokerAction.CHECK
      }
      this.handleAction(playerView, action)
    }
  }

  private handleAction(player: PlayerView, action: PokerAction): void {
    this._tableModel.handleAction(player.playerModel, action)
    this.executeActionEffect(player, action)
    player.displayActionText(action)
    this._actionButtons?.setVisible(false)
  }

  // eslint-disable-next-line
  private executeActionEffect(player: PlayerView, action: PokerAction): void {
    switch (action) {
      case PokerAction.FOLD:
        player.removeAllHand()
        break
      case PokerAction.CALL:
        player.animatePlaceBet()
        break
      case PokerAction.RAISE:
        player.animatePlaceBet()
        break
      case PokerAction.CHECK:
        break
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  }

  private showActionButtons(x: number, y: number, player: Player): void {
    const offset: number = 60
    const wspace: number = 120
    const hspace: number = 160

    const callOrCheck: string =
      this._tableModel.currentMaxBet - player.bet > 0
        ? PokerAction.CALL
        : PokerAction.CHECK

    this.createButton(x - offset, y + hspace, PokerAction.FOLD)
    this.createButton(x + wspace - offset, y + hspace, callOrCheck)
    if (!this._tableModel.anyoneRaisedThisRound()) {
      this.createButton(x + wspace * 2 - offset, y + hspace, PokerAction.RAISE)
    }
    this._actionButtons.setVisible(true)
  }

  private createButton(x: number, y: number, textContent: string): void {
    const container: Phaser.GameObjects.Container = this.scene.add.container()
    const button: Phaser.GameObjects.Image = this.scene.add
      .image(x, y, 'btn-dark')
      .setScale(1.3, 0.8)
      .setInteractive({ useHandCursor: true })
    const text: Phaser.GameObjects.Text = this.scene.add.text(
      x,
      y,
      textContent.toUpperCase(),
      { font: '16px' }
    )
    text.setOrigin(0.5, 0.5)
    text.setName(textContent)

    container.add([button, text])
    this._actionButtons.add(container)

    button.on('pointerover', () => {
      button.setScale(1.4, 0.9)
    })
    button.on('pointerout', () => {
      button.setScale(1.3, 0.8)
    })
  }

  private async getUserAction(): Promise<PokerAction> {
    return new Promise((resolve) => {
      this._actionButtons.each((child: Phaser.GameObjects.Container) => {
        child.list[0].on('pointerdown', () => {
          resolve(child.list[1].name as PokerAction)
        })
      })
    })
  }

  private async dealCommunityCards(cardsToAdd: number): Promise<void> {
    const cardViews: CardView[] = []
    const offset: number = 14

    for (let i: number = 0; i < cardsToAdd; i += 1) {
      const card: Card = this._tableModel.drawValidCardFromDeck()
      const cardView: CardView = new CardView(
        this.scene,
        this._deckView.x,
        this._deckView.y - offset,
        card
      )

      this._tableModel.communityCards.addOne(card)
      cardViews.push(cardView)
      this.scene.add.existing(cardView)
      this._communityCards.add(cardView)

      cardView.animateCardMove(
        this._sceneWidth / 2 + this._communityCards.length * 45 - 140,
        this._sceneHeight / 2 - offset / 2
      )
      await delay(100) // eslint-disable-line
    }
    await delay(1000)
    cardViews.forEach((card: CardView) => {
      card.open()
    })
  }

  public async showDown(): Promise<void> {
    this._tableModel.round = PokerRound.Showdown

    const communityCard: Card[] = this._tableModel.communityCards.cards
    this._playerViews.forEach((player: PlayerView) => {
      if (player.playerModel.isActive) {
        this.processPlayerShowdown(player, communityCard)
      }
    })
    const winners: PlayerView[] = this.findWinners()
    this.distributeWinnings(winners)
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

  private distributeWinnings(winners: PlayerView[]): void {
    const winningsPerPlayer: number = Math.floor(
      this._tableModel.pot.getTotalPot() / winners.length
    )

    winners.forEach((player: PlayerView) => {
      player.playerModel.addChips(winningsPerPlayer)
      player.displayResultTexts(winningsPerPlayer)
      player.animateRefundToWinner()
    })
  }

  private async prepareNextGame(): Promise<void> {
    this.displayPromptText()
    await this.waitForUserClick()
    this.resetTableAndView()
  }

  private displayPromptText(): void {
    this._promptText.setVisible(true)
    this.scene.tweens.add({
      targets: this._promptText,
      alpha: { start: 1, to: 0.3 },
      duration: 800,
      ease: 'Linear',
      repeat: -1,
      yoyo: true
    })
  }

  private async waitForUserClick(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.scene.input.once('pointerdown', () => {
        resolve()
      })
    })
  }

  private resetTableAndView(): void {
    this._tableModel.resetGame()
    this._promptText.setVisible(false)
    this._communityCards.removeAll(true)
    this._playerViews.forEach((player: PlayerView) => {
      player.prepareForNextGame()
    })
  }
}
