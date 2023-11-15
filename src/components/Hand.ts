import { Card } from "@/components/Card"

export class Hand {
  private hand: Card[]

  constructor() {
    this.hand = []
  }

  public getHand(): Card[] {
    return [...this.hand]
  }

  public addOne(card: Card): void {
    this.hand.push(card)
  }

  public pickOne(): Card | undefined {
    return this.hand.shift()
  }

  // TODO: 必要ないかも
  public replaceHand(cards: Card[]): void {
    this.hand = [...cards]
  }

  public cleanHand(): void {
    this.hand = []
  }

  public getCardCount(): number {
    return this.hand.length
  }
}
