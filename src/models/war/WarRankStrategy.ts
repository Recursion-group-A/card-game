import { Rank } from '@/types/common/rank-types'
import { RankStrategy } from '@/models/common/RankStrategy'
import rankValues from '@/models/war/rankValues'

export default class WarRankStrategy implements RankStrategy {
  // eslint-disable-next-line
  public getRankNumber(rank: Rank): number {
    const value: number | undefined = rankValues[rank]
    if (value === undefined) {
      throw new Error(`Invalid rank: ${rank}`)
    }

    return value
  }
}
