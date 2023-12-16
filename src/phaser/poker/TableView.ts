import Phaser from 'phaser'
import Card from '@/models/common/Card'
import CardView from '@/phaser/common/CardView'
import Deck from '@/models/common/Deck'
import DeckView from '@/phaser/common/DeckView'
import Player from '@/models/poker/Player'
import PlayerView from '@/phaser/poker/PlayerView'
import Table from '@/models/poker/Table'
import PLAYERTYPES from '@/types/playerTypes'
import { delay } from '@/utils/utils'

export default class TableView extends Phaser.GameObjects.Container {
  private readonly _tableModel: Table

  private readonly _playerModels: Player[]

  private readonly _playerViews: PlayerView[] = []

  private readonly _deckModel: Deck

  private readonly _deckView: DeckView

  private readonly _communityCards: Phaser.GameObjects.Container

  private readonly _potTotalText: Phaser.GameObjects.Text

  private readonly _actionButtons: Phaser.GameObjects.Container

  private readonly _background: Phaser.GameObjects.Image

  private _sceneWidth: number = this.scene.cameras.main.width

  private _sceneHeight: number = this.scene.cameras.main.height

  constructor(scene: Phaser.Scene, tableModel: Table) {
    super(scene)
    this._tableModel = tableModel
    this._playerModels = this._tableModel.players
    this._deckModel = this._tableModel.deck
    this._deckView = new DeckView(
      this.scene,
      this._sceneWidth / 2 + 150,
      this._sceneHeight / 2,
      new Deck(this._tableModel.gameType)
    )
    this._communityCards = this.scene.add.container()
    this._potTotalText = this.scene.add.text(
      this._sceneWidth / 2 - 35,
      this._sceneHeight / 2 - 100,
      `POT: $${this._tableModel.pot.getTotalPot()}`,
      { font: '18px' }
    )
    this._actionButtons = this.scene.add.container()
    this._background = this.scene.add.image(
      this._sceneWidth / 2,
      this._sceneHeight / 2,
      'table'
    )

    this.add([
      this._background,
      this._deckView,
      this._communityCards,
      this._potTotalText,
      this._actionButtons
    ])

    const playersPos: { x: number; y: number }[] = [
      { x: 750, y: 100 },
      { x: 750, y: 350 },
      { x: 455, y: 550 }, // プレイヤー
      { x: 150, y: 350 },
      { x: 150, y: 100 },
      { x: 450, y: 100 }
    ]

    this._playerModels.forEach((player: Player, index: number) => {
      const playerView: PlayerView = new PlayerView(
        this.scene,
        player,
        playersPos[index]
      )
      this._playerViews.push(playerView)
      this.add(playerView)
    })

    this._deckModel.shuffle()
    scene.add.existing(this)
  }

  public update() {
    this._potTotalText?.setText(`POT: $${this._tableModel.pot.getTotalPot()}`)
  }

  public assignDealerBtn(): void {
    this._tableModel.assignRandomDealerButton()

    // 全プレイヤーのディーラーボタンを削除する
    this._playerViews.forEach((player: PlayerView) => {
      player.removeDealerBtn()
    })

    const { dealerIndex } = this._tableModel
    const dealerPlayer: PlayerView = this._playerViews[dealerIndex]
    dealerPlayer.addDealerBtn()
  }

  public async animateCollectBlinds(): Promise<void> {
    this._tableModel.collectBlind(
      this._tableModel.sbIndex,
      this._tableModel.smallBlind
    )
    const sbPlayer: PlayerView = this._playerViews[this._tableModel.sbIndex]
    sbPlayer.animatePlaceBet()

    await delay(800)

    this._tableModel.collectBlind(
      this._tableModel.bbIndex,
      this._tableModel.bigBlind
    )
    const bbPlayer: PlayerView = this._playerViews[this._tableModel.bbIndex]
    bbPlayer.animatePlaceBet()
  }

  public async dealCardToPlayers(): Promise<void> {
    const totalPlayers: number = this._playerModels.length

    for (let times: number = 0; times < 2; times += 1) {
      let currentIndex: number = this._tableModel.sbIndex

      for (let i: number = 0; i < totalPlayers; i += 1) {
        const currentPlayer: PlayerView = this._playerViews[currentIndex]
        const card: Card = this._tableModel.drawValidCardFromDeck()
        currentPlayer.playerModel.addHand(card)

        await delay(150) // eslint-disable-line
        currentPlayer.addCardToHand(
          this._deckView.x,
          this._deckView.y - 14,
          card,
          times
        )
        currentIndex = (currentIndex + 1) % totalPlayers
      }
    }
  }

  public revealUserHand(): void {
    const user: PlayerView = this._playerViews.filter(
      (player: PlayerView) =>
        player.playerModel.playerType === PLAYERTYPES.PLAYER
    )[0]
    user.revealHand()
  }

  public async startRound(start: number, cardsToAdd: number): Promise<void> {
    let index: number = start
    let actionCompleted: number = 0

    while (actionCompleted < this._tableModel.players.length) {
      const currentPlayer: PlayerView = this._playerViews[index]
      const currentPlayerModel: Player = currentPlayer.playerModel

      if (currentPlayerModel.isActive) {
        await delay(600) // eslint-disable-line
        if (currentPlayerModel.playerType === PLAYERTYPES.PLAYER) {
          this.showActionButtons(currentPlayer.x - 60, currentPlayer.y)
          const action: string = await this.getUserAction() // eslint-disable-line

          this._tableModel.handleAction(currentPlayerModel, action)
          this.handleAction(currentPlayer, action)

          currentPlayer.showActionText(action)
          this.removeActionButtons()

          if (action === 'raise') {
            actionCompleted = 0
          }
        } else {
          const action: string = this._tableModel.determineAIAction()
          this._tableModel.handleAction(currentPlayerModel, action)
          this.handleAction(currentPlayer, action)
          currentPlayer.showActionText(action)

          if (action === 'raise') {
            actionCompleted = 0
          }
        }
      }
      index = (index + 1) % this._tableModel.players.length
      actionCompleted += 1
    }

    await delay(1000)
    if (cardsToAdd > 0) {
      await this.dealCommunityCards(cardsToAdd)
    }
  }

  // eslint-disable-next-line
  private handleAction(player: PlayerView, action: string): void {
    switch (action) {
      case 'fold':
        player.setInVisibleHandCards()
        break
      case 'call':
        player.animatePlaceBet()
        break
      case 'raise':
        player.animatePlaceBet()
        break
      case 'check':
        break
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  }

  private showActionButtons(x: number, y: number): void {
    const wspace: number = 120
    const hspace: number = 160

    this._actionButtons.setVisible(true)
    this.createButton(x, y + hspace, 'fold')
    this.createButton(x + wspace, y + hspace, 'call')
    this.createButton(x + wspace * 2, y + hspace, 'raise')
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
    container.setSize(button.width, button.height)

    button.on('pointerover', () => {
      button.setScale(1.35, 0.9)
    })
    button.on('pointerout', () => {
      button.setScale(1.3, 0.8)
    })
  }

  private removeActionButtons(): void {
    this._actionButtons.setVisible(false)
  }

  private async getUserAction(): Promise<string> {
    return new Promise((resolve) => {
      this._actionButtons.each((child: Phaser.GameObjects.Container) => {
        child.list[0].on('pointerdown', () => {
          resolve(child.list[1].name)
        })
      })
    })
  }

  private async dealCommunityCards(cardsToAdd: number): Promise<void> {
    const cardViews: CardView[] = []
    for (let i: number = 0; i < cardsToAdd; i += 1) {
      const card: Card = this._tableModel.drawValidCardFromDeck()
      const cardView: CardView = new CardView(
        this.scene,
        this._deckView.x,
        this._deckView.y - 2 * 7,
        card
      )

      this.scene.add.existing(cardView)
      this._communityCards.add(cardView)
      cardViews.push(cardView)

      cardView.animateCardMove(
        this._sceneWidth / 2 + this._communityCards.length * 45 - 140,
        this._sceneHeight / 2 - 7
      )
      await delay(200) // eslint-disable-line
    }
    await delay(1000)
    cardViews.forEach((card: CardView) => {
      card.open()
    })
  }

  public showDown(): void {
    this._playerViews.forEach((player: PlayerView) => {
      player.revealHand()
    })

    this._tableModel.showDown()
  }
}
