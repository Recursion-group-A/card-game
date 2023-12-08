import Phaser from 'phaser'
import Deck from '@/models/common/Deck'

export default class DeckView extends Phaser.GameObjects.Container {
  private readonly numOfCards: number = 8

  private readonly offset: number = 2

  private deckModel: Deck

  constructor(scene: Phaser.Scene, x: number, y: number, deckModel: Deck) {
    super(scene, x, y)
    this.deckModel = deckModel

    for (let i: number = 0; i < this.numOfCards; i += 1) {
      const card: Phaser.GameObjects.Image = scene.add
        .image(0, -i * this.offset, 'card-back')
        .setScale(1)
      this.add(card)
    }
    scene.add.existing(this)
  }
}
