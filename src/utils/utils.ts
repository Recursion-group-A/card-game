import { GameTypes } from '@/types/common/game-types'
import { RankStrategy } from '@/models/common/RankStrategy'
import BlackjackRankStrategy from '@/models/blackjack/BlackjackRankStrategy'
import PokerRankStrategy from '@/models/poker/PokerRankStrategy'
import WarRankStrategy from '@/models/war/WarRankStrategy'

export function getRankStrategy(gameType: GameTypes): RankStrategy {
  if (gameType === GameTypes.Blackjack) {
    return new BlackjackRankStrategy()
  }
  if (gameType === GameTypes.Poker) {
    return new PokerRankStrategy()
  }
  return new WarRankStrategy()
}

export function delay(ms: number): Promise<void> {
  // eslint-disable-next-line
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
