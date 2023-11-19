import { Rank } from '@/types/ranks'

export interface RankStrategy {
  getRankNumber(rank: Rank): number
}
