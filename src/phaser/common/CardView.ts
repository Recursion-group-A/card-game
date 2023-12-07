import Phaser from 'phaser'
import Card from '@/models/common/Card'

export default class CardView extends Phaser.GameObjects.Image {
  private cardModel: Card

  constructor(scene: Phaser.Scene, x: number, y: number, cardModel: Card) {
    super(scene, x, y, 'card-back')
    this.cardModel = cardModel

    this.scene.add.existing(this)
    this.setInteractive({ useHandCursor: true })
    this.on('pointerdown', () => {
      if (this.cardModel.getIsFaceDown()) {
        this.open()
      } else {
        this.close()
      }
    })
  }

  public setFaceUp(): void {
    this.cardModel.setIsFaceDown(false)
    this.setTexture(this.getAtlasFrame())
  }

  public setFaceDown(): void {
    this.cardModel.setIsFaceDown(true)
    this.setTexture('card-back')
  }

  public open(): void {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      duration: 150,
      ease: 'Linear',
      onComplete: (): void => {
        this.setFaceUp()
        this.scene.tweens.add({
          targets: this,
          scaleX: 1,
          duration: 150,
          ease: 'Linear'
        })
      }
    })
  }

  public close(): void {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      duration: 150,
      ease: 'Linear',
      onComplete: (): void => {
        this.setFaceDown()
        this.scene.tweens.add({
          targets: this,
          scaleX: 1,
          duration: 150,
          ease: 'Linear'
        })
      }
    })
  }

  public animateCardMove(newX: number, newY: number): void {
    this.scene.tweens.add({
      targets: this,
      x: newX,
      y: newY,
      duration: 500,
      ease: 'Power2'
    })
  }

  private getAtlasFrame(): string {
    const suitAndRank: string = this.cardModel.toString()
    return `card_${suitAndRank}`
  }
}
