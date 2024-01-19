import Card from '@/models/common/Card'
import Hand from '@/models/common/Hand'

export default class BlackjackHand extends Hand {
  public calculateBlackjackTotal(): number {
    let total: number = 0
    let aceCount: number = 0

    this.cards.forEach((card: Card) => {
      if (card.rank === 'A') {
        aceCount += 1
      }
      total += card.getRankNumber()
    })

    while (aceCount > 0 && total <= 11) {
      total += 10
      aceCount -= 1
    }

    return total
  }

  public isBlackjack(): boolean {
    return this.calculateBlackjackTotal() === 21 && this.getCardCount() === 2
  }

  public isBust(): boolean {
    return this.calculateBlackjackTotal() > 21
  }

  public canHit(): boolean {
    return !this.isBlackjack() && !this.isBust()
  }

  public isHandTotalScoreAbove17(): boolean {
    return this.calculateBlackjackTotal() >= 17
  }
}
