import Deck from '@/models/common/Deck'
import DeckView from '@/phaser/common/DeckView'
import PokerRankStrategy from '@/models/poker/PokerRankStrategy'
import { GAMETYPE } from '@/types/gameTypes'
import ButtonView from '@/phaser/common/ButtonView'
import Phaser from 'phaser'

export default class PokerScene extends Phaser.Scene {
  constructor() {
    super('PokerScene')
  }

  public create(): void {
    this.add.image(400, 300, 'table')

    const deckModel: Deck = new Deck(GAMETYPE.Poker, new PokerRankStrategy())
    const deckView: DeckView = new DeckView(this, 900, 150, deckModel)

    const drawButton = new ButtonView(this, 100, 200, 'DRAW', () => {
      deckView.addCardToField()
    })

    console.log(drawButton.x)
  }
}
