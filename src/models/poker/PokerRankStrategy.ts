import { Rank } from '@/types/ranks'
import { RankStrategy } from '@/models/common/RankStrategy'
import rankValues from '@/models/poker/rankValues'

export default class PokerRankStrategy implements RankStrategy {
  // eslint-disable-next-line
  public getRankNumber(rank: Rank): number {
    const value: number | undefined = rankValues[rank]
    if (value === undefined) {
      throw new Error(`Invalid rank: ${rank}`)
    }

    return value
  }
}
