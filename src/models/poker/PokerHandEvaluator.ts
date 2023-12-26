import Card from '@/models/common/Card'
import { Suit } from '@/types/common/suit-types'
import PokerHand from '@/types/poker/hand-types'

export default class PokerHandEvaluator {
  public static evaluateHand(hand: Card[], communityCards: Card[]): PokerHand {
    const combinedCards: Card[] = [...hand, ...communityCards]

    if (PokerHandEvaluator.isRoyalStraightFlush(combinedCards)) {
      return PokerHand.RoyalStraightFlush
    }
    if (PokerHandEvaluator.isStraightFlush(combinedCards)) {
      return PokerHand.StraightFlush
    }
    if (PokerHandEvaluator.isFourOfAKind(combinedCards)) {
      return PokerHand.FourOfAKind
    }
    if (PokerHandEvaluator.isFullHouse(combinedCards)) {
      return PokerHand.FullHouse
    }
    if (PokerHandEvaluator.isFlush(combinedCards)) {
      return PokerHand.Flush
    }
    if (PokerHandEvaluator.isStraight(combinedCards)) {
      return PokerHand.Straight
    }
    if (PokerHandEvaluator.isThreeOfAKind(combinedCards)) {
      return PokerHand.ThreeOfAKind
    }
    if (PokerHandEvaluator.isTwoPair(combinedCards)) {
      return PokerHand.TwoPair
    }
    if (PokerHandEvaluator.isOnePair(combinedCards)) {
      return PokerHand.OnePair
    }
    return PokerHand.HighCard
  }

  private static isRoyalStraightFlush(cards: Card[]): boolean {
    const cardsAboveTen: Card[] = cards.filter(
      (card: Card) => card.getRankNumber() >= 10
    )
    return PokerHandEvaluator.isStraightFlush(cardsAboveTen)
  }

  private static isStraightFlush(cards: Card[]): boolean {
    const suitCountMap: Map<Suit, number> =
      PokerHandEvaluator.getSuitCountMap(cards)

    let straightFlushExists: boolean = false
    suitCountMap.forEach((count: number, suit: Suit) => {
      if (count >= 5) {
        const sameSuitCards: Card[] = cards.filter(
          (card: Card) => card.suit === suit
        )
        straightFlushExists = PokerHandEvaluator.isStraight(sameSuitCards)
      }
    })
    return straightFlushExists
  }

  private static isFourOfAKind(cards: Card[]): boolean {
    const rankCountMap: Map<number, number> =
      PokerHandEvaluator.getRankCountMap(cards)
    let fourOfAKindExists: boolean = false

    rankCountMap.forEach((count: number) => {
      if (count >= 4) {
        fourOfAKindExists = true
      }
    })
    return fourOfAKindExists
  }

  private static isFullHouse(cards: Card[]): boolean {
    const rankCountMap: Map<number, number> =
      PokerHandEvaluator.getRankCountMap(cards)

    let threeOfAKindExists: boolean = false
    let onePairExists: boolean = false
    let numOfThreeOfAKind: number = 0

    rankCountMap.forEach((count: number) => {
      if (count >= 3) {
        threeOfAKindExists = true
        numOfThreeOfAKind += 1
      } else if (count >= 2) {
        onePairExists = true
      }
    })

    return (threeOfAKindExists && onePairExists) || numOfThreeOfAKind >= 2
  }

  private static isFlush(cards: Card[]): boolean {
    const suitCountMap = PokerHandEvaluator.getSuitCountMap(cards)
    let flushExits: boolean = false

    suitCountMap.forEach((count: number) => {
      if (count >= 5) {
        flushExits = true
      }
    })
    return flushExits
  }

  private static isStraight(cards: Card[]): boolean {
    const rankCountMap: Map<number, number> =
      PokerHandEvaluator.getRankCountMap(cards)

    const sortedArrayByRank: number[] = Array.from(rankCountMap.keys()).sort(
      (a: number, b: number) => a - b
    )

    let sequences: number = 1
    for (let i = 0; i < sortedArrayByRank.length - 1; i += 1) {
      if (sortedArrayByRank[i] + 1 === sortedArrayByRank[i + 1]) {
        sequences += 1
        if (sequences >= 5) {
          return true
        }
      } else {
        sequences = 1
      }
    }
    return (
      sequences < 5 &&
      rankCountMap.has(14) &&
      sortedArrayByRank[0] === 2 &&
      sortedArrayByRank[1] === 3 &&
      sortedArrayByRank[2] === 4 &&
      sortedArrayByRank[3] === 5
    )
  }

  private static isThreeOfAKind(cards: Card[]): boolean {
    const rankCountMap: Map<number, number> =
      PokerHandEvaluator.getRankCountMap(cards)
    let threeOfAKindExists: boolean = false

    rankCountMap.forEach((count: number) => {
      if (count >= 3) {
        threeOfAKindExists = true
      }
    })
    return threeOfAKindExists
  }

  private static isTwoPair(cards: Card[]): boolean {
    const rankCountMap: Map<number, number> =
      PokerHandEvaluator.getRankCountMap(cards)

    let pairsFound: number = 0
    rankCountMap.forEach((count: number) => {
      if (count >= 2) {
        pairsFound += 1
      }
    })
    return pairsFound >= 2
  }

  private static isOnePair(cards: Card[]): boolean {
    const rankCountMap: Map<number, number> =
      PokerHandEvaluator.getRankCountMap(cards)
    let onePairExists: boolean = false

    rankCountMap.forEach((count: number) => {
      if (count >= 2) {
        onePairExists = true
      }
    })
    return onePairExists
  }

  private static getSuitCountMap(cards: Card[]): Map<Suit, number> {
    const suitCountMap: Map<Suit, number> = new Map<Suit, number>()

    cards.forEach((card: Card) => {
      const { suit } = card

      if (suit !== undefined) {
        const currentCount: number = suitCountMap.get(suit) || 0
        suitCountMap.set(suit, currentCount + 1)
      }
    })
    return suitCountMap
  }

  private static getRankCountMap(cards: Card[]): Map<number, number> {
    const rankCountMap: Map<number, number> = new Map<number, number>()

    cards.forEach((card: Card) => {
      const rank: number = card.getRankNumber()
      const currentCount: number = rankCountMap.get(rank) || 0

      rankCountMap.set(rank, currentCount + 1)
    })
    return rankCountMap
  }
}
