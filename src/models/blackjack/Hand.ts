import Card from '@/models/blackjack/Card'

export default class Hand {
  private _cards: Card[] = []

  get cards(): Card[] {
    return [...this._cards]
  }

  public addOne(card: Card): void {
    this._cards.push(card)
  }

  public cleanHand(): void {
    this._cards = []
  }

  public getCardCount(): number {
    return this._cards.length
  }

  // TODO:ブラックジャックに特化
  public getHandTotalScore(): number {
    let total = 0
    let aceCount = 0

    this._cards.forEach((card: Card) => {
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

  public getHandTotal(): number {
    let total: number = 0
    this._cards.forEach((card: Card) => {
      total += card.getRankNumber()
    })
    return total
  }

  public getIndexAt(index: number): Card {
    if (index >= this._cards.length) {
      throw new Error(`Invalid index: Length of hand is ${this._cards.length}.`)
    }
    return this._cards[index]
  }

  public isBlackjack(): boolean {
    return this.getHandTotalScore() === 21 && this.getCardCount() === 2
  }

  public isBust(): boolean {
    return this.getHandTotalScore() > 21
  }

  public canHit(): boolean {
    return !this.isBlackjack() && !this.isBust()
  }
}
