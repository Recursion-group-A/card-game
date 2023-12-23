import Phaser from 'phaser'

export default class DeckView extends Phaser.GameObjects.Container {
  private readonly numOfCards: number = 8

  private readonly offset: number = 2

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.createCards(scene)
    scene.add.existing(this)
  }

  private createCards(scene: Phaser.Scene): void {
    for (let i: number = 0; i < this.numOfCards; i += 1) {
      const card: Phaser.GameObjects.Image = scene.add
        .image(0, -i * this.offset, 'card-back')
        .setScale(1)
      this.add(card)
    }
  }
}
