import * as Phaser from 'phaser'
import Card from '@/models/common/Card'
import CardView from '@/phaser/common/CardView'
import DeckView from '@/phaser/common/DeckView'
import PokerPlayer from '@/models/poker/PokerPlayer'
import PlayerView from '@/phaser/poker/PlayerView'
import PokerTable from '@/models/poker/PokerTable'
import PokerActions from '@/types/poker/action-types'
import PlayerTypes from '@/types/common/player-types'
import { delay } from '@/utils/utils'

export default class TableView extends Phaser.GameObjects.Container {
  private readonly _sceneWidth: number = this.scene.cameras.main.width

  private readonly _sceneHeight: number = this.scene.cameras.main.height

  private readonly _tableModel: PokerTable

  private readonly _playerViews: PlayerView[] = []

  private readonly _deckView: DeckView

  private readonly _potTotalText: Phaser.GameObjects.Text

  private readonly _promptText: Phaser.GameObjects.Text

  private readonly _communityCards: Phaser.GameObjects.Container

  private readonly _actionButtons: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene, tableModel: PokerTable) {
    super(scene)

    this._tableModel = tableModel
    this._deckView = this.createDeckView()
    this._potTotalText = this.createPotTotalText()
    this._promptText = this.createPromptText()
    this._communityCards = this.scene.add.container()
    this._actionButtons = this.scene.add.container()
    this.createPlayerViews()

    this.add([
      this._deckView,
      this._communityCards,
      this._potTotalText,
      this._actionButtons,
      this._promptText
    ])

    scene.add.existing(this)
  }

  update() {
    this._potTotalText.setText(`POT: $${this._tableModel.pot.getTotalPot()}`)
  }

  public assignDealerButton(): void {
    this._playerViews.forEach((player: PlayerView) => {
      player.setInvisibleDealerBtn()
    })
    this._playerViews[this._tableModel.dealerIndex].addDealerBtn()
  }

  public revealUserHand(): void {
    const user: PlayerView = this._playerViews.filter(
      (player: PlayerView) =>
        player.playerModel.playerType === PlayerTypes.Player
    )[0]
    user.revealHand()
  }

  public displayActionButtons(player: PlayerView): void {
    const offset: number = 60
    const wspace: number = 120
    const hspace: number = 160

    const callOrCheck: string =
      this._tableModel.currentMaxBet - player.playerModel.bet > 0
        ? PokerActions.Call
        : PokerActions.Check

    this.createButton(player.x - offset, player.y + hspace, PokerActions.Fold)
    this.createButton(
      player.x + wspace - offset,
      player.y + hspace,
      callOrCheck
    )
    if (!this._tableModel.anyoneRaisedThisRound()) {
      this.createButton(
        player.x + wspace * 2 - offset,
        player.y + hspace,
        PokerActions.Raise
      )
    }
    this.setVisibleActionButtons(true)
  }

  public setVisibleActionButtons(bool: boolean) {
    this._actionButtons.setVisible(bool)
  }

  public async getUserAction(): Promise<PokerActions> {
    return new Promise((resolve) => {
      this._actionButtons.each((child: Phaser.GameObjects.Container) => {
        child.list[0].on('pointerdown', () => {
          resolve(child.list[1].name as PokerActions)
        })
      })
    })
  }

  // eslint-disable-next-line
  public executeActionEffect(player: PlayerView, action: PokerActions): void {
    player.displayActionText(action)

    switch (action) {
      case PokerActions.Fold:
        player.removeAllHand()
        break
      case PokerActions.Call:
        player.animatePlaceBet()
        break
      case PokerActions.Raise:
        player.animatePlaceBet()
        break
      case PokerActions.Check:
        break
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  }

  public async dealCommunityCards(cardsToAdd: number): Promise<void> {
    const cardViews: CardView[] = []
    const offset: number = 14

    for (let i: number = 0; i < cardsToAdd; i += 1) {
      const card: Card = this._tableModel.drawCard()
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

  // eslint-disable-next-line
  public distributeWinnings(
    winners: PlayerView[],
    winningsPerPlayer: number
  ): void {
    winners.forEach((player: PlayerView) => {
      player.playerModel.addChips(winningsPerPlayer)
      player.displayResultTexts(winningsPerPlayer)
      player.animateRefundToWinner()
    })
  }

  public displayPromptText(): void {
    this._promptText.setVisible(true)
    this.scene.tweens.add({
      targets: this._promptText,
      alpha: { start: 2, to: 0.5 },
      duration: 800,
      ease: 'Linear',
      repeat: -1,
      yoyo: true
    })
  }

  public resetTableAndView(): void {
    this._promptText.setVisible(false)
    this._communityCards.removeAll(true)
    this._playerViews.forEach((player: PlayerView) => {
      player.prepareForNextGame()
    })
  }

  private createDeckView(): DeckView {
    return new DeckView(
      this.scene,
      this._sceneWidth / 2 + 150,
      this._sceneHeight / 2
    )
  }

  private createPotTotalText(): Phaser.GameObjects.Text {
    return this.scene.add.text(
      this._sceneWidth / 2 - 40,
      this._sceneHeight / 2 - 85,
      'POT: $0',
      { font: '18px' }
    )
  }

  private createPromptText(): Phaser.GameObjects.Text {
    return this.scene.add
      .text(
        this._sceneWidth / 2 - 130,
        this._sceneHeight / 2 + 65,
        '(Press anywhere to continue)'
      )
      .setVisible(false)
  }

  private createPlayerViews(): void {
    const playersPos: { x: number; y: number }[] = [
      { x: 750, y: 100 },
      { x: 750, y: 350 },
      { x: 455, y: 550 }, // プレイヤー
      { x: 150, y: 350 },
      { x: 150, y: 100 },
      { x: 450, y: 100 }
    ]
    this._tableModel.players.forEach((player: PokerPlayer, index: number) => {
      const playerView: PlayerView = new PlayerView(
        this.scene,
        player,
        playersPos[index]
      )
      this._playerViews.push(playerView)
      this.add(playerView)
    })
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

  get playerViews(): PlayerView[] {
    return this._playerViews
  }

  get deckView(): DeckView {
    return this._deckView
  }
}
