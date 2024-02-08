import * as Phaser from 'phaser'
import Card from '@/models/common/Card'

export default class CardView extends Phaser.GameObjects.Image {
  private readonly _cardModel: Card

  constructor(scene: Phaser.Scene, x: number, y: number, cardModel: Card) {
    super(scene, x, y, 'card-back')

    this._cardModel = cardModel
    this.scene.add.existing(this)
  }

  public animateCardMove(newX: number, newY: number): void {
    this.scene.tweens.add({
      targets: this,
      x: newX,
      y: newY,
      duration: 600,
      ease: 'Power2'
    })
  }

  public open(): void {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      duration: 150,
      ease: 'Linear',
      onComplete: (): void => {
        this.setTexture(`card_${this._cardModel.toString()}`)
        this.scene.tweens.add({
          targets: this,
          scaleX: 1,
          duration: 250,
          ease: 'Linear'
        })
      }
    })
  }

  public animateWarCardMove(isPlayer: boolean): void {
    const targetX: number = this.scene.cameras.main.width / 2
    const targetY: number = this.scene.cameras.main.height / 2

    this.scene.tweens.add({
      targets: this,
      x: targetX,
      y: isPlayer ? targetY + 50 : targetY - 50,
      duration: 200,
      ease: 'Power2'
    })
  }

  get cardModel(): Card {
    return this._cardModel
  }
}
