import Phaser from 'phaser'
import Card from '@/models/common/Card'
import Player from '@/models/poker/Player'
import CardView from '@/phaser/common/CardView'

export default class PlayerView extends Phaser.GameObjects.Container {
  private playerModel: Player

  private readonly playerNameText: Phaser.GameObjects.Text

  private readonly chipsText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, x: number, y: number, playerModel: Player) {
    super(scene, x, y)
    this.playerModel = playerModel

    this.playerNameText = this.scene.add.text(
      30,
      0,
      `${this.playerModel.playerType.toUpperCase()}`
    )

    const cardHeight: number = 64
    this.chipsText = this.scene.add.text(
      10,
      cardHeight + 40,
      `Chips: ${this.playerModel.chips}`
    )

    this.add([this.playerNameText, this.chipsText])
    this.updateHand()

    scene.add.existing(this)
  }

  public update(): void {
    this.chipsText.setText(`Chips: ${this.playerModel.chips}`)
    this.updateHand()
  }

  private updateHand(): void {
    this.removeAllCards()

    const { hand } = this.playerModel
    hand.forEach((card: Card, index: number) => {
      const cardView: CardView = new CardView(this.scene, 0, 0, card)
      cardView.x = index * 25 + 45
      cardView.y = this.playerNameText.y + 60
      this.add(cardView)
    })
  }

  private removeAllCards(): void {
    this.remove(
      this.list.filter(
        (child: Phaser.GameObjects.GameObject) => child instanceof CardView
      ),
      true
    )
  }
}
