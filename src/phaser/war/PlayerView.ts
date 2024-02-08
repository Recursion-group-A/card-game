import * as Phaser from 'phaser'
import Card from '@/models/common/Card'
import WarPlayer from '@/models/war/WarPlayer'
import CardView from '@/phaser/common/CardView'

export default class PlayerView extends Phaser.GameObjects.Container {
  private readonly _playerModel: WarPlayer

  private _playerNameText: Phaser.GameObjects.Text

  private _chipsText: Phaser.GameObjects.Text

  private readonly _handCardViews: Phaser.GameObjects.Container

  private _cardCount: Phaser.GameObjects.Text

  constructor(
    scene: Phaser.Scene,
    player: WarPlayer,
    playerPosition: { x: number; y: number }
  ) {
    super(scene, playerPosition.x, playerPosition.y)

    this._playerModel = player
    this._playerNameText = this.createPlayerNameText()
    this._chipsText = this.createChipsText()
    this._cardCount = this.createGetCardCount().setVisible(false)
    this._handCardViews = this.scene.add.container()

    this.add([
      this._playerNameText,
      this._chipsText,
      this._handCardViews,
      this._cardCount,
      this._handCardViews
    ])
    scene.add.existing(this)
  }

  update(): void {
    this._cardCount.setText(`COUNT: ${this._playerModel.acquiredCards}`)
  }

  public animateAddHand(x: number, y: number, card: Card, i: number): void {
    const cardView: CardView = new CardView(this.scene, x, y, card)
    cardView.animateCardMove(this.x + (i + 1) * 15 - 145, this.y + 60)

    this._handCardViews.add(cardView)
    this.scene.add.existing(this._handCardViews)
    if (this.playerModel.isPlayer) {
      cardView.setInteractive({ useHandCursor: true })
    }
  }

  public async getUserAction(): Promise<CardView> {
    return new Promise((resolve) => {
      this._handCardViews.each((card: CardView) => {
        const clickHandler = () => {
          card.setScale(1)
          this.setNonInteractiveAllCards()
          this._handCardViews.remove(card)
          resolve(card)
        }

        card.on('pointerover', () => card.setScale(1.1))
        card.on('pointerout', () => card.setScale(1))
        card.on('pointerdown', clickHandler)
      })
    })
  }

  private setNonInteractiveAllCards(): void {
    this._handCardViews.each((card: CardView) => {
      card.setInteractive(false)
      card.off('pointerover')
      card.off('pointerout')
      card.off('pointerdown')
    })
  }

  private createPlayerNameText(): Phaser.GameObjects.Text {
    const x: number = 40
    const y: number = this.playerModel.isPlayer ? 64 + 50 : -20

    this._playerNameText = this.scene.add.text(
      x,
      y,
      `${this._playerModel.playerName.toUpperCase()}`
    )
    return this._playerNameText
  }

  private createChipsText(): Phaser.GameObjects.Text {
    if (!this.playerModel.isPlayer) {
      return this.scene.add.text(0, 0, '')
    }
    this._chipsText = this.scene.add.text(
      0,
      64 + 80, // カードの高さ → 64
      `CHIPS: ${this._playerModel.chips}`
    )
    return this._chipsText
  }

  private createGetCardCount(): Phaser.GameObjects.Text {
    const cardCount: number = this._playerModel.acquiredCards
    const x: number = this.playerModel.isPlayer ? -295 : 340
    const y: number = this.playerModel.isPlayer ? 110 : 0

    this._cardCount = this.scene.add.text(x, y, `COUNT: ${cardCount}`)
    return this._cardCount
  }

  get playerModel(): WarPlayer {
    return this._playerModel
  }

  get handCardViews(): Phaser.GameObjects.Container {
    return this._handCardViews
  }

  get cardCount(): Phaser.GameObjects.Text {
    return this._cardCount
  }
}
