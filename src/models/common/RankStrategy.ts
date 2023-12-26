import { Rank } from '@/types/common/rank-types'

export interface RankStrategy {
  getRankNumber(rank: Rank): number
}
