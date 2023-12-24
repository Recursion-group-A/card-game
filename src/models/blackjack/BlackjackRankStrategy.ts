import { Rank } from '@/types/common/ranks'
import { RankStrategy } from '@/models/common/RankStrategy'
import rankValues from '@/models/blackjack/rankValues'

export default class BlackjackRankStrategy implements RankStrategy {
  // eslint-disable-next-line
  public getRankNumber(rank: Rank): number {
    const value: number | undefined = rankValues[rank]
    if (value === undefined) {
      throw new Error(`Invalid rank: ${rank}`)
    }
    return value
  }
}
