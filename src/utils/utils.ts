import { GAMETYPE } from '@/types/common/gameTypes'
import { RankStrategy } from '@/models/common/RankStrategy'
import BlackjackRankStrategy from '@/models/blackjack/BlackjackRankStrategy'
import PokerRankStrategy from '@/models/poker/PokerRankStrategy'

export function getRankStrategy(gameType: GAMETYPE): RankStrategy {
  return gameType === GAMETYPE.Blackjack
    ? new BlackjackRankStrategy()
    : new PokerRankStrategy()
}

export function delay(ms: number): Promise<void> {
  // eslint-disable-next-line
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
