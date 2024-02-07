import * as Phaser from 'phaser'
import Card from '@/models/common/Card'
import WarPlayer from '@/models/war/WarPlayer'
import CardView from '@/phaser/common/CardView'

export default class PlayerView extends Phaser.GameObjects.Container {
  private readonly _playerModel: WarPlayer

  private _playerNameText: Phaser.GameObjects.Text

  private _chipsText: Phaser.GameObjects.Text

  private readonly _handCardViews: Phaser.GameObjects.Container

  constructor(
    scene: Phaser.Scene,
    player: WarPlayer,
    playerPosition: { x: number; y: number },
    index: number
  ) {
    super(scene, playerPosition.x, playerPosition.y)

    this._playerModel = player
    this._playerNameText = this.createPlayerNameText(index)
    this._chipsText = this.createChipsText(index)
    this._handCardViews = this.scene.add.container()

    this.add([this._playerNameText, this._chipsText, this._handCardViews])
    scene.add.existing(this)
  }

  public animateAddHand(x: number, y: number, card: Card, i: number): void {
    const cardView: CardView = new CardView(this.scene, x, y, card)
    cardView.animateCardMove(this.x + (i + 1) * 15 - 145, this.y + 60)
    cardView.setClickable()

    this._handCardViews.add(cardView)
    this.scene.add.existing(this._handCardViews)
  }

  private createPlayerNameText(index: number): Phaser.GameObjects.Text {
    const x: number = 40
    const y: number = index === 0 ? -20 : 64 + 50

    this._playerNameText = this.scene.add.text(
      x,
      y,
      `${this._playerModel.playerName.toUpperCase()}`
    )
    return this._playerNameText
  }

  private createChipsText(index: number): Phaser.GameObjects.Text {
    if (index === 0) {
      return this.scene.add.text(0, 0, '')
    }
    this._chipsText = this.scene.add.text(
      0,
      64 + 80, // カードの高さ → 64
      `CHIPS: ${this._playerModel.chips}`
    )
    return this._chipsText
  }

  public async getUserAction(): Promise<CardView> {
    return new Promise((resolve) => {
      this._handCardViews.each((card: CardView) => {
        card.on('pointerdown', () => {
          resolve(card)
        })
      })
    })
  }

  get playerModel(): WarPlayer {
    return this._playerModel
  }

  get handCardViews() {
    return this._handCardViews
  }
}
