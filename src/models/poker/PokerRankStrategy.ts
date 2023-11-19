import { Rank } from '@/types/ranks'
import { RankStrategy } from '@/models/common/RankStrategy'

export default class PokerRankStrategy implements RankStrategy {
  public getRankNumber(rank: Rank): number {
    // eslint-disable-line
    const rankValues: { [key in Rank]: number } = {
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 10,
      J: 11,
      Q: 12,
      K: 13,
      A: 14,
      Joker: 0
    }

    const value: number = rankValues[rank]
    if (!rank) {
      throw new Error(`Invalid rank: ${rank}`)
    }

    return value
  }
}
