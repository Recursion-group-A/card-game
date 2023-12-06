import Phaser from 'phaser'
import Card from '@/models/common/Card'

export default class CardView extends Phaser.GameObjects.Image {
  private model: Card

  // TODO: いらないかも
  private readonly initialX: number

  private readonly initialY: number

  constructor(scene: Phaser.Scene, x: number, y: number, model: Card) {
    super(scene, x, y, 'card-back')
    this.model = model
    this.initialX = x
    this.initialY = y

    this.scene.add.existing(this)
    this.setInteractive({ useHandCursor: true })
    this.on('pointerdown', () => {
      this.open()
    })
  }

  public setFaceUp(): void {
    this.model.setIsFaceDown(false)
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

  public animateCardMove(newX: number, newY: number): void {
    this.scene.tweens.add({
      targets: this,
      x: newX,
      y: newY,
      duration: 900,
      ease: 'Power2'
    })
  }

  public returnToStartPosition(): void {
    this.setPosition(this.initialX, this.initialY)
  }

  public setDraggable(): void {
    this.scene.input.setDraggable(this)
  }

  private getAtlasFrame(): string {
    const suitAndRank: string = this.model.toString()
    return `card_${suitAndRank}.png`
  }
}
