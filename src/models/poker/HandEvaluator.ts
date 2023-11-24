import Card from '@/models/common/Card'
import PokerHand from '@/models/poker/PokerHand'
import { Suit } from '@/types/suits'

// TODO: テスト
export default class HandEvaluator {
  public static evaluateHand(hand: Card[], communityCards: Card[]): PokerHand {
    const combinedCards: Card[] = [...hand, ...communityCards]

    if (HandEvaluator.isRoyalStraightFlush(combinedCards)) {
      return PokerHand.RoyalStraightFlush
    }
    if (HandEvaluator.isStraightFlush(combinedCards)) {
      return PokerHand.StraightFlush
    }
    if (HandEvaluator.isFourOfAKind(combinedCards)) {
      return PokerHand.FourOfAKind
    }
    if (HandEvaluator.isFullHouse(combinedCards)) {
      return PokerHand.FullHouse
    }
    if (HandEvaluator.isFlush(combinedCards)) {
      return PokerHand.Flush
    }
    if (HandEvaluator.isStraight(combinedCards)) {
      return PokerHand.Straight
    }
    if (HandEvaluator.isThreeOfAKind(combinedCards)) {
      return PokerHand.ThreeOfAKind
    }
    if (HandEvaluator.isTwoPair(combinedCards)) {
      return PokerHand.TwoPair
    }
    if (HandEvaluator.isOnePair(combinedCards)) {
      return PokerHand.OnePair
    }
    return PokerHand.HighCard
  }

  private static isRoyalStraightFlush(cards: Card[]): boolean {
    const cardsAboveTen: Card[] = cards.filter(
      (c: Card) => c.getRankNumber() >= 10
    )
    return HandEvaluator.isStraightFlush(cardsAboveTen)
  }

  private static isStraightFlush(cards: Card[]): boolean {
    const suitCountMap: Map<Suit, number> = HandEvaluator.getSuitCountMap(cards)

    //  eslint-disable-next-line
    for (const [suit, count] of suitCountMap) {
      if (count >= 5) {
        const suitCards: Card[] = cards.filter(
          (c: Card) => c.getSuit() === suit
        )
        if (HandEvaluator.isStraight(suitCards)) {
          return true
        }
      }
    }
    return false
  }

  private static isFourOfAKind(cards: Card[]): boolean {
    const rankCountMap = HandEvaluator.getRankCountMap(cards)
    let fourOfAKindExists: boolean = false

    rankCountMap.forEach((count: number) => {
      if (count >= 4) {
        fourOfAKindExists = true
      }
    })
    return fourOfAKindExists
  }

  private static isFullHouse(cards: Card[]): boolean {
    const rankCountMap = HandEvaluator.getRankCountMap(cards)

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
    const suitCountMap = HandEvaluator.getSuitCountMap(cards)
    let flushExits: boolean = false

    suitCountMap.forEach((count: number) => {
      if (count >= 5) {
        flushExits = true
      }
    })
    return flushExits
  }

  private static isStraight(cards: Card[]): boolean {
    const uniqueRanks = Array.from(
      new Set(cards.map((card) => card.getRankNumber()))
    )
    uniqueRanks.sort((a, b) => a - b)

    if (uniqueRanks.includes(14) && !uniqueRanks.includes(1)) {
      uniqueRanks.unshift(1) // エースをランク1として先頭に追加
    }

    // 連続する5枚のカードを探す
    for (let i = 0; i < uniqueRanks.length - 4; i += 1) {
      let isSequential = true
      for (let j = i; j < i + 4; j += 1) {
        if (uniqueRanks[j] + 1 !== uniqueRanks[j + 1]) {
          isSequential = false
          break
        }
      }
      if (isSequential) {
        return true
      }
    }
    return false
  }

  private static isThreeOfAKind(cards: Card[]): boolean {
    const rankCountMap = HandEvaluator.getRankCountMap(cards)
    let threeOfAKindExists: boolean = false

    rankCountMap.forEach((count: number) => {
      if (count >= 3) {
        threeOfAKindExists = true
      }
    })
    return threeOfAKindExists
  }

  private static isTwoPair(cards: Card[]): boolean {
    const rankCountMap = HandEvaluator.getRankCountMap(cards)

    let pairsFound: number = 0
    rankCountMap.forEach((count: number) => {
      if (count >= 2) {
        pairsFound += 1
      }
    })
    return pairsFound >= 2
  }

  private static isOnePair(cards: Card[]): boolean {
    const rankCountMap = HandEvaluator.getRankCountMap(cards)
    let onePairExists: boolean = false

    rankCountMap.forEach((count: number) => {
      if (count >= 2) {
        onePairExists = true
      }
    })
    return onePairExists
  }

  private static getSuitCountMap(cards: Card[]): Map<Suit, number> {
    const suitCountMap = new Map<Suit, number>()

    // eslint-disable-next-line
    for (const card of cards) {
      const suit = card.getSuit()

      if (suit !== undefined) {
        const updatedCount: number = (suitCountMap.get(suit) || 0) + 1
        suitCountMap.set(suit, updatedCount)
      }
    }
    return suitCountMap
  }

  private static getRankCountMap(cards: Card[]): Map<number, number> {
    const rankCountMap = new Map<number, number>()

    // eslint-disable-next-line
    for (const card of cards) {
      const rank: number = card.getRankNumber()
      const updatedCount: number = (rankCountMap.get(rank) || 0) + 1
      rankCountMap.set(rank, updatedCount)
    }
    return rankCountMap
  }
}
