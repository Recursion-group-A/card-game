import Card from '@/models/common/Card'
import Hand from '@/models/common/Hand'
import Deck from '@/models/common/Deck'
import { PLAYER_STATES } from '@/constants/playerStates'

export default class House {
  private hand: Hand

  constructor() {
    this.hand = new Hand()
  }

  // TODO: START Playerクラスと共通する処理 → 後で抽象クラス Participant クラスを作る
  public addCard(card: Card): void {
    this.hand.addOne(card)
  }

  public isBlackjack(): boolean {
    return this.hand.isBlackjack()
  }
  // TODO: END Playerクラスと共通する処理

  // House 特有のアクション
  // public revealHand(): void {
  //     TODO: 伏せたカードを表向きにするアクション
  // }

  public drawUntilSeventeen(deck: Deck): string {
    while (this.hand.getHandTotalScore() < 17) {
      const card: Card | undefined = deck.drawOne()

      if (!card) {
        throw new Error('Deck is empty.')
      }

      this.addCard(card)

      if (this.hand.getHandTotalScore() > 21) {
        return PLAYER_STATES.BUST
      }
    }
    return PLAYER_STATES.STAND
  }
}
