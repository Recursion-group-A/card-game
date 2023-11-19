import { Rank } from '@/types/ranks'
import { RankStrategy } from '@/models/common/RankStrategy'

export default class BlackjackRankStrategy implements RankStrategy {
  public getRankNumber(rank: Rank): number {
    // eslint-disable-line
    if (rank === 'Joker') {
      return 0 // ジョーカーの場合は0とする（ブラックジャックでは使用されない）
    }
    if (rank === 'A') {
      return 1
    }
    if (rank === 'K' || rank === 'Q' || rank === 'J') {
      return 10
    }
    return parseInt(rank, 10)
  }
}
