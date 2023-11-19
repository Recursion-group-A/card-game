import { Suit } from '@/types/suits'
import { Rank } from '@/types/ranks'

export default class Card {
  private suit?: Suit

  private rank: Rank

  constructor(suit: Suit | undefined, rank: Rank) {
    this.suit = suit

    this.rank = rank
  }

  // ファクトリメソッドを使ったジョーカーインスタンスの作成
  public static createJoker(): Card {
    return new Card(undefined, 'Joker')
  }

  public getSuit(): Suit | undefined {
    return this.suit
  }

  // TODO: 必要ないかも
  public getRank(): Rank {
    return this.rank
  }

  // TODO: 後で実装する ゲームごとに違う 今はブラックジャック用
  public getRankNumber(): number {
    if (this.rank === 'Joker') {
      return 0 // ジョーカーの場合は0とする（ブラックジャックでは使用されない）
    }
    if (this.rank === 'A') {
      return 1
    }
    if (this.rank === 'K' || this.rank === 'Q' || this.rank === 'J') {
      return 10
    }
    return parseInt(this.rank, 10)
  }

  public toString(): string {
    if (this.rank === 'Joker') {
      return 'Joker'
    }
    return this.suit ? `${this.suit}${this.rank}` : this.rank
  }
}
