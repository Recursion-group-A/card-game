import Phaser from 'phaser'
import Card from '@/models/common/Card'
import Deck from '@/models/common/Deck'
import CardView from '@/phaser/common/CardView'

export default class DeckView extends Phaser.GameObjects.Container {
  private readonly numOfCards: number = 8

  private readonly offset: number = 2

  private deckModel: Deck

  private readonly deckSize: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, x: number, y: number, deckModel: Deck) {
    super(scene, x, y)
    this.deckModel = deckModel
    this.deckModel.shuffle()

    for (let i: number = 0; i < this.numOfCards; i += 1) {
      const card: Phaser.GameObjects.Image = scene.add
        .image(0, -i * this.offset, 'card-back')
        .setScale(1)
      this.add(card)
    }

    this.deckSize = this.scene.add.text(
      -10,
      -60,
      `${this.deckModel.getDeckSize()}`
    )

    this.add(this.deckSize)
    scene.add.existing(this)
  }

  public update(): void {
    this.deckSize.setText(`${this.deckModel.getDeckSize()}`)
  }

  public addCardToField(newX: number, newY: number): void {
    const cardModel: Card | undefined = this.deckModel.drawOne()

    if (!cardModel) {
      this.deckModel.resetDeck()
    } else {
      const cardView: CardView = new CardView(
        this.scene,
        this.x,
        this.y - this.numOfCards * this.offset,
        cardModel
      )
      this.scene.add.existing(cardView)
      cardView.animateCardMove(newX, newY)
    }
  }
}
