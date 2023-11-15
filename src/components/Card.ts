import { Suit, Rank } from "@/constants/constants"

export class Card {
  private suit?: Suit
  private rank: Rank | "Joker"

  constructor(suit: Suit | undefined, rank: Rank | "Joker") {
    this.suit = suit
    this.rank = rank
  }

  public getSuit(): Suit | undefined {
    return this.suit
  }

  public getRank(): Rank | "Joker" {
    return this.rank
  }

  // TODO: 後で実装する ゲームごとに違う
  public getRankNumber(): void {}

  public toString(): string {
    return this.suit ? this.suit + this.rank : this.rank
  }
}
