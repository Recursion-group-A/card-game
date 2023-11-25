import { Suit } from '@/types/suits'
import { Rank } from '@/types/ranks'
import { RankStrategy } from '@/models/common/RankStrategy'

export default class Card {
  private readonly suit?: Suit

  private readonly rank: Rank

  private rankStrategy: RankStrategy

  constructor(suit: Suit | undefined, rank: Rank, rankStrategy: RankStrategy) {
    this.suit = suit

    this.rank = rank

    this.rankStrategy = rankStrategy
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

  public getSuit(): Suit | undefined {
    return this.suit
  }

  public getRank(): Rank {
    return this.rank
  }

  /**
   * カードのランクを数値で取得します。
   * このメソッドは、ストラテジーパターンを使用してランクを計算し、
   * ゲームごとに異なるランクの計算ロジックを適用します。
   *
   * @returns カードのランクに対応する数値
   */
  public getRankNumber(): number {
    return this.rankStrategy.getRankNumber(this.rank)
  }

  public toString(): string {
    if (this.rank === 'Joker') {
      return 'Joker'
    }
    return this.suit ? `${this.suit}${this.rank}` : this.rank
  }
}
