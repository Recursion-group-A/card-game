import { Rank } from '@/types/common/ranks'

export interface RankStrategy {
  getRankNumber(rank: Rank): number
}
