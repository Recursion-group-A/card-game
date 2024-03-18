import Card from '@/models/common/Card'

export default class Hand {
  protected _cards: Card[] = []

  public addOne(card: Card): void {
    if (!card) {
      throw new Error('Invalid card')
    }
    this._cards.push(card)
  }

  public popOne(card: Card): void {
    const index: number = this._cards.indexOf(card)
    if (index !== -1) {
      this._cards.splice(index, 1)
    }
  }

  public resetHand(): void {
    this._cards = []
  }

  public getCardCount(): number {
    return this._cards.length
  }

  public getHandTotal(): number {
    return this._cards.reduce(
      (total: number, card: Card) => total + card.getRankNumber(),
      0
    )
  }

  get cards(): Card[] {
    return this._cards
  }
}
