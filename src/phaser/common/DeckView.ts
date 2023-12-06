import Phaser from 'phaser'
import Card from '@/models/common/Card'
import Deck from '@/models/common/Deck'
import CardView from '@/phaser/common/CardView'

export default class DeckView extends Phaser.GameObjects.Container {
  private static numOfCards: number = 8

  private static offset: number = 2

  private deckModel: Deck

  constructor(scene: Phaser.Scene, x: number, y: number, deckModel: Deck) {
    super(scene, x, y)
    this.deckModel = deckModel

    for (let i: number = 0; i < DeckView.numOfCards; i += 1) {
      const card: Phaser.GameObjects.Image = scene.add
        .image(0, -i * DeckView.offset, 'card-back')
        .setScale(1)
      this.add(card)
    }

    scene.add.existing(this)
  }

  public addCardToField(): void {
    const cardModel: Card | undefined = this.deckModel.drawOne()

    if (cardModel) {
      const cardView: CardView = new CardView(
        this.scene,
        this.x,
        this.y - DeckView.numOfCards * DeckView.offset,
        cardModel
      )
      this.scene.add.existing(cardView)
      cardView.animateCardMove(Math.random() * 900, Math.random() * 800)
    } else {
      this.deckModel.resetDeck()
    }
  }
}
