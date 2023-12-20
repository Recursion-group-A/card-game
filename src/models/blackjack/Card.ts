import { Suit } from '@/types/suits'
import { Rank } from '@/types/ranks'
import { RankStrategy } from '@/models/common/RankStrategy'

export default class Card {
  private readonly _suit: Suit | undefined

  private readonly _rank: Rank

  private readonly _rankStrategy: RankStrategy

  private _isFaceDown: boolean

  constructor(suit: Suit | undefined, rank: Rank, rankStrategy: RankStrategy) {
    this._suit = suit
    this._rank = rank
    this._rankStrategy = rankStrategy
    this._isFaceDown = true
  }

  /**
   * ファクトリメソッドを使用してジョーカーのカードインスタンスを作成します。
   * ジョーカーは特殊なカードであり、通常のスートやランクを持ちません。
   *
   * @param rankStrategy - ランクを計算するための戦略
   * @returns ジョーカーのカードインスタンス
   */
  public static createJoker(rankStrategy: RankStrategy): Card {
    return new Card(undefined, 'Joker', rankStrategy)
  }

  get suit(): Suit | undefined {
    return this._suit
  }

  get rank(): Rank {
    return this._rank
  }

  get isFaceDown(): boolean {
    return this._isFaceDown
  }

  set isFaceDown(bool: boolean) {
    this._isFaceDown = bool
  }

  /**
   * カードのランクを数値で取得します。
   * このメソッドは、ストラテジーパターンを使用してランクを計算し、
   * ゲームごとに異なるランクの計算ロジックを適用します。
   *
   * @returns カードのランクに対応する数値
   */
  public getRankNumber(): number {
    return this._rankStrategy.getRankNumber(this.rank)
  }

  public toString(): string {
    if (!this.suit) {
      return 'Joker'
    }

    const FACE_CARDS: string[] = ['10', 'J', 'Q', 'K', 'A']
    const suitMap: { [key in Suit]: string } = {
      S: 'spades',
      C: 'clubs',
      H: 'hearts',
      D: 'diamonds'
    }
    const suitName: string = suitMap[this.suit]
    const rankName: string = FACE_CARDS.includes(this.rank)
      ? this.rank
      : `0${this.rank.toString()}`

    return `${suitName}_${rankName}`
  }
}
