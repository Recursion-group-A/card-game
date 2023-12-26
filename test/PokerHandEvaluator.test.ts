import Card from '@/models/common/Card'
import PokerRankStrategy from '@/models/poker/PokerRankStrategy'
import PokerHandEvaluator from '@/models/poker/PokerHandEvaluator'
import { RankStrategy } from '@/models/common/RankStrategy'

const mockRankStrategy: RankStrategy = new PokerRankStrategy()

describe('evaluateHand', () => {
  it('should return 9: RoyalStraightFlush', () => {
    const hand: Card[] = [
      new Card('D', '10', mockRankStrategy),
      new Card('D', 'J', mockRankStrategy)
    ]
    const communityCards: Card[] = [
      new Card('D', 'Q', mockRankStrategy),
      new Card('D', 'K', mockRankStrategy),
      new Card('D', 'A', mockRankStrategy),
      new Card('D', '4', mockRankStrategy),
      new Card('H', '8', mockRankStrategy)
    ]
    expect(PokerHandEvaluator.evaluateHand(hand, communityCards)).toBe(9)
  })
  it('should return 8: StraightFlush', () => {
    const hand: Card[] = [
      new Card('C', 'J', mockRankStrategy),
      new Card('C', 'Q', mockRankStrategy)
    ]
    const communityCards: Card[] = [
      new Card('C', '10', mockRankStrategy),
      new Card('C', 'K', mockRankStrategy),
      new Card('C', '9', mockRankStrategy),
      new Card('S', '2', mockRankStrategy),
      new Card('D', 'J', mockRankStrategy)
    ]
    expect(PokerHandEvaluator.evaluateHand(hand, communityCards)).toBe(8)
  })
  it('should return 7: FourOfAKind', () => {
    const hand: Card[] = [
      new Card('S', '10', mockRankStrategy),
      new Card('C', '10', mockRankStrategy)
    ]
    const communityCards: Card[] = [
      new Card('D', '10', mockRankStrategy),
      new Card('H', '10', mockRankStrategy),
      new Card('S', '4', mockRankStrategy),
      new Card('H', 'K', mockRankStrategy),
      new Card('C', 'J', mockRankStrategy)
    ]
    expect(PokerHandEvaluator.evaluateHand(hand, communityCards)).toBe(7)
  })
  it('should return 6: FullHouse', () => {
    const hand: Card[] = [
      new Card('D', '6', mockRankStrategy),
      new Card('S', 'K', mockRankStrategy)
    ]
    const communityCards: Card[] = [
      new Card('H', '6', mockRankStrategy),
      new Card('C', '6', mockRankStrategy),
      new Card('S', 'K', mockRankStrategy),
      new Card('D', '10', mockRankStrategy),
      new Card('D', '9', mockRankStrategy)
    ]
    expect(PokerHandEvaluator.evaluateHand(hand, communityCards)).toBe(6)
  })
  it('should return 5: Flush', () => {
    const hand: Card[] = [
      new Card('H', '3', mockRankStrategy),
      new Card('H', '8', mockRankStrategy)
    ]
    const communityCards: Card[] = [
      new Card('D', '10', mockRankStrategy),
      new Card('C', '10', mockRankStrategy),
      new Card('H', '9', mockRankStrategy),
      new Card('H', 'J', mockRankStrategy),
      new Card('H', 'Q', mockRankStrategy)
    ]
    expect(PokerHandEvaluator.evaluateHand(hand, communityCards)).toBe(5)
  })
  it('should return 4: Straight', () => {
    const hand: Card[] = [
      new Card('C', '4', mockRankStrategy),
      new Card('D', '7', mockRankStrategy)
    ]
    const communityCards: Card[] = [
      new Card('H', '5', mockRankStrategy),
      new Card('S', 'Q', mockRankStrategy),
      new Card('S', 'K', mockRankStrategy),
      new Card('C', '6', mockRankStrategy),
      new Card('D', '8', mockRankStrategy)
    ]
    expect(PokerHandEvaluator.evaluateHand(hand, communityCards)).toBe(4)
  })
  it('should return 3: ThreeOfAKind', () => {
    const hand: Card[] = [
      new Card('D', 'J', mockRankStrategy),
      new Card('H', 'J', mockRankStrategy)
    ]
    const communityCards: Card[] = [
      new Card('H', 'A', mockRankStrategy),
      new Card('S', '8', mockRankStrategy),
      new Card('D', '5', mockRankStrategy),
      new Card('S', 'K', mockRankStrategy),
      new Card('C', 'J', mockRankStrategy)
    ]
    expect(PokerHandEvaluator.evaluateHand(hand, communityCards)).toBe(3)
  })
  it('should return 2: TwoPair', () => {
    const hand: Card[] = [
      new Card('S', '10', mockRankStrategy),
      new Card('C', '3', mockRankStrategy)
    ]
    const communityCards: Card[] = [
      new Card('H', '10', mockRankStrategy),
      new Card('S', '5', mockRankStrategy),
      new Card('C', 'Q', mockRankStrategy),
      new Card('D', '5', mockRankStrategy),
      new Card('S', 'A', mockRankStrategy)
    ]
    expect(PokerHandEvaluator.evaluateHand(hand, communityCards)).toBe(2)
  })
  it('should return 1: OnePair', () => {
    const hand: Card[] = [
      new Card('C', 'A', mockRankStrategy),
      new Card('H', 'J', mockRankStrategy)
    ]
    const communityCards: Card[] = [
      new Card('H', 'Q', mockRankStrategy),
      new Card('C', '9', mockRankStrategy),
      new Card('S', '6', mockRankStrategy),
      new Card('H', '3', mockRankStrategy),
      new Card('S', 'A', mockRankStrategy)
    ]
    expect(PokerHandEvaluator.evaluateHand(hand, communityCards)).toBe(1)
  })
  it('should return 0: HighCard', () => {
    const hand: Card[] = [
      new Card('S', '10', mockRankStrategy),
      new Card('D', '9', mockRankStrategy)
    ]
    const communityCards: Card[] = [
      new Card('H', 'A', mockRankStrategy),
      new Card('H', '5', mockRankStrategy),
      new Card('D', 'J', mockRankStrategy),
      new Card('C', '7', mockRankStrategy),
      new Card('S', '4', mockRankStrategy)
    ]
    expect(PokerHandEvaluator.evaluateHand(hand, communityCards)).toBe(0)
  })
})

// describe('isRoyalStraightFlush', () => {
//   it('should return [true] for a royal-flush hand', () => {
//     const royalFlushHand: Card[] = [
//       new Card('D', '10', mockRankStrategy),
//       new Card('D', 'J', mockRankStrategy),
//       new Card('D', 'Q', mockRankStrategy),
//       new Card('D', 'K', mockRankStrategy),
//       new Card('D', 'A', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy),
//       new Card('S', '10', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isRoyalStraightFlush(royalFlushHand)).toBeTruthy()
//   })
//   it('should return [false] for a straight-flush hand', () => {
//     const straightFlushHand: Card[] = [
//       new Card('H', '9', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy),
//       new Card('H', 'J', mockRankStrategy),
//       new Card('H', 'Q', mockRankStrategy),
//       new Card('H', 'K', mockRankStrategy),
//       new Card('D', '3', mockRankStrategy),
//       new Card('S', 'J', mockRankStrategy)
//     ]
//     expect(
//       PokerHandEvaluator.isRoyalStraightFlush(straightFlushHand)
//     ).toBeFalsy()
//   })
//   it('should return [false] for a flush hand', () => {
//     const flushHand: Card[] = [
//       new Card('H', '3', mockRankStrategy),
//       new Card('H', '5', mockRankStrategy),
//       new Card('H', '6', mockRankStrategy),
//       new Card('H', '8', mockRankStrategy),
//       new Card('H', '9', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy),
//       new Card('H', 'Q', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isRoyalStraightFlush(flushHand)).toBeFalsy()
//   })
//   it('should return [false] for a straight hand', () => {
//     const straightHand: Card[] = [
//       new Card('D', '10', mockRankStrategy),
//       new Card('H', 'J', mockRankStrategy),
//       new Card('S', 'Q', mockRankStrategy),
//       new Card('C', 'K', mockRankStrategy),
//       new Card('H', 'A', mockRankStrategy),
//       new Card('S', '4', mockRankStrategy),
//       new Card('D', '9', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isRoyalStraightFlush(straightHand)).toBeFalsy()
//   })
// })

// describe('isStraightFlush', () => {
//   it('should return [true] for a royal-flush hand', () => {
//     const royalFlushHand: Card[] = [
//       new Card('C', '10', mockRankStrategy),
//       new Card('C', 'J', mockRankStrategy),
//       new Card('C', 'Q', mockRankStrategy),
//       new Card('C', 'K', mockRankStrategy),
//       new Card('C', 'A', mockRankStrategy),
//       new Card('H', '4', mockRankStrategy),
//       new Card('S', '10', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraightFlush(royalFlushHand)).toBeTruthy()
//   })
//   it('should return [true] for a straight-flush hand (without A)', () => {
//     const straightFlushHand: Card[] = [
//       new Card('S', '9', mockRankStrategy),
//       new Card('S', '10', mockRankStrategy),
//       new Card('S', 'J', mockRankStrategy),
//       new Card('S', 'Q', mockRankStrategy),
//       new Card('S', 'K', mockRankStrategy),
//       new Card('D', '9', mockRankStrategy),
//       new Card('D', '9', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraightFlush(straightFlushHand)).toBeTruthy()
//   })
//   it('should return [true] for a straight-flush hand (with A)', () => {
//     const straightFlushHand: Card[] = [
//       new Card('C', 'A', mockRankStrategy),
//       new Card('C', '2', mockRankStrategy),
//       new Card('C', '3', mockRankStrategy),
//       new Card('C', '4', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('S', '10', mockRankStrategy),
//       new Card('D', 'J', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraightFlush(straightFlushHand)).toBeTruthy()
//   })
//   it('should return [false] for a not straight-flush hand', () => {
//     const notStraightFlushHand: Card[] = [
//       new Card('S', '7', mockRankStrategy),
//       new Card('S', '8', mockRankStrategy),
//       new Card('S', '9', mockRankStrategy),
//       new Card('S', '10', mockRankStrategy),
//       new Card('D', 'J', mockRankStrategy),
//       new Card('H', 'Q', mockRankStrategy),
//       new Card('C', 'K', mockRankStrategy)
//     ]
//     expect(
//       PokerHandEvaluator.isStraightFlush(notStraightFlushHand)
//     ).not.toBeTruthy()
//   })
//   it('should return [false] for a flush hand', () => {
//     const flushHand: Card[] = [
//       new Card('H', '5', mockRankStrategy),
//       new Card('H', '7', mockRankStrategy),
//       new Card('H', '8', mockRankStrategy),
//       new Card('H', '9', mockRankStrategy),
//       new Card('H', 'J', mockRankStrategy),
//       new Card('H', '4', mockRankStrategy),
//       new Card('S', '5', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraightFlush(flushHand)).toBeFalsy()
//   })
//   it('should return [false] for a straight hand', () => {
//     const straightHand: Card[] = [
//       new Card('D', '2', mockRankStrategy),
//       new Card('H', '3', mockRankStrategy),
//       new Card('C', '4', mockRankStrategy),
//       new Card('H', '5', mockRankStrategy),
//       new Card('S', '6', mockRankStrategy),
//       new Card('D', '10', mockRankStrategy),
//       new Card('D', 'Q', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraightFlush(straightHand)).toBeFalsy()
//   })
// })

// describe('isFourOfAKind', () => {
//   it('should return [false] for a royal-flush hand', () => {
//     const royalFlushHand: Card[] = [
//       new Card('S', '10', mockRankStrategy),
//       new Card('S', 'J', mockRankStrategy),
//       new Card('S', 'Q', mockRankStrategy),
//       new Card('S', 'K', mockRankStrategy),
//       new Card('S', 'A', mockRankStrategy),
//       new Card('D', '4', mockRankStrategy),
//       new Card('H', '7', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFourOfAKind(royalFlushHand)).toBeFalsy()
//   })
//   it('should return [false] for a straight-flush hand', () => {
//     const straightFlushHand: Card[] = [
//       new Card('D', '4', mockRankStrategy),
//       new Card('D', '5', mockRankStrategy),
//       new Card('D', '6', mockRankStrategy),
//       new Card('D', '7', mockRankStrategy),
//       new Card('D', '8', mockRankStrategy),
//       new Card('C', 'A', mockRankStrategy),
//       new Card('S', 'J', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFourOfAKind(straightFlushHand)).toBeFalsy()
//   })
//   it('should return [true] for a four-of-a-kind hand', () => {
//     const fourOfAKindHand: Card[] = [
//       new Card('S', '10', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy),
//       new Card('D', '10', mockRankStrategy),
//       new Card('C', '10', mockRankStrategy),
//       new Card('S', '2', mockRankStrategy),
//       new Card('H', '5', mockRankStrategy),
//       new Card('H', '7', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFourOfAKind(fourOfAKindHand)).toBeTruthy()
//   })
//   it('should return [false] for a full-house hand', () => {
//     const fullHouseHand: Card[] = [
//       new Card('C', '2', mockRankStrategy),
//       new Card('D', '2', mockRankStrategy),
//       new Card('S', '2', mockRankStrategy),
//       new Card('S', '10', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy),
//       new Card('H', 'J', mockRankStrategy),
//       new Card('C', 'Q', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFourOfAKind(fullHouseHand)).toBeFalsy()
//   })
//   it('should return [false] for a flush hand', () => {
//     const flushHand: Card[] = [
//       new Card('C', '2', mockRankStrategy),
//       new Card('C', '3', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('C', '9', mockRankStrategy),
//       new Card('C', 'K', mockRankStrategy),
//       new Card('S', 'J', mockRankStrategy),
//       new Card('H', 'A', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFourOfAKind(flushHand)).toBeFalsy()
//   })
//   it('should return [false] for a straight hand', () => {
//     const straightHand: Card[] = [
//       new Card('S', '3', mockRankStrategy),
//       new Card('D', '4', mockRankStrategy),
//       new Card('H', '5', mockRankStrategy),
//       new Card('S', '6', mockRankStrategy),
//       new Card('H', '7', mockRankStrategy),
//       new Card('C', '10', mockRankStrategy),
//       new Card('C', 'Q', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFourOfAKind(straightHand)).toBeFalsy()
//   })
//   it('should return [false] for a three-of-a-kind hand', () => {
//     const threeOfAKindHand: Card[] = [
//       new Card('S', '8', mockRankStrategy),
//       new Card('H', '8', mockRankStrategy),
//       new Card('D', '8', mockRankStrategy),
//       new Card('S', '4', mockRankStrategy),
//       new Card('C', '10', mockRankStrategy),
//       new Card('C', 'A', mockRankStrategy),
//       new Card('H', 'K', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFourOfAKind(threeOfAKindHand)).toBeFalsy()
//   })
//   it('should return [false] for a two-pair hand', () => {
//     const twoPairHand: Card[] = [
//       new Card('H', '4', mockRankStrategy),
//       new Card('C', '4', mockRankStrategy),
//       new Card('S', '10', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy),
//       new Card('C', '8', mockRankStrategy),
//       new Card('D', 'Q', mockRankStrategy),
//       new Card('D', '5', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFourOfAKind(twoPairHand)).toBeFalsy()
//   })
//   it('should return [false] for a one-pair hand', () => {
//     const onePairHand: Card[] = [
//       new Card('S', 'K', mockRankStrategy),
//       new Card('C', 'K', mockRankStrategy),
//       new Card('D', 'Q', mockRankStrategy),
//       new Card('H', '7', mockRankStrategy),
//       new Card('C', '10', mockRankStrategy),
//       new Card('H', '2', mockRankStrategy),
//       new Card('S', 'A', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFourOfAKind(onePairHand)).toBeFalsy()
//   })
//   it('should return [false] for a high-card hand', () => {
//     const highCardHand: Card[] = [
//       new Card('S', '2', mockRankStrategy),
//       new Card('D', '4', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('D', '7', mockRankStrategy),
//       new Card('H', '9', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy),
//       new Card('S', 'Q', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFourOfAKind(highCardHand)).toBeFalsy()
//   })
// })

// describe('isFullHouse', () => {
//   it('should return [false] for a royal-flush hand', () => {
//     const royalFlushHand: Card[] = [
//       new Card('H', '10', mockRankStrategy),
//       new Card('H', 'J', mockRankStrategy),
//       new Card('H', 'Q', mockRankStrategy),
//       new Card('H', 'K', mockRankStrategy),
//       new Card('H', 'A', mockRankStrategy),
//       new Card('S', '8', mockRankStrategy),
//       new Card('D', '9', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFullHouse(royalFlushHand)).toBeFalsy()
//   })
//   it('should return [false] for a straight-flush hand', () => {
//     const straightFlushHand: Card[] = [
//       new Card('S', '4', mockRankStrategy),
//       new Card('S', '5', mockRankStrategy),
//       new Card('S', '6', mockRankStrategy),
//       new Card('S', '7', mockRankStrategy),
//       new Card('S', '8', mockRankStrategy),
//       new Card('D', 'Q', mockRankStrategy),
//       new Card('S', 'A', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFullHouse(straightFlushHand)).toBeFalsy()
//   })
//   it('should return [false] for a four-of-a-kind hand', () => {
//     const fourOfAKindHand: Card[] = [
//       new Card('S', '2', mockRankStrategy),
//       new Card('D', '2', mockRankStrategy),
//       new Card('H', '2', mockRankStrategy),
//       new Card('C', '2', mockRankStrategy),
//       new Card('D', '5', mockRankStrategy),
//       new Card('S', '7', mockRankStrategy),
//       new Card('S', '10', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFullHouse(fourOfAKindHand)).toBeFalsy()
//   })
//   it('should return [true] for a full-house hand', () => {
//     const fullHouseHand: Card[] = [
//       new Card('S', '7', mockRankStrategy),
//       new Card('D', '7', mockRankStrategy),
//       new Card('C', '7', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('S', '5', mockRankStrategy),
//       new Card('H', '2', mockRankStrategy),
//       new Card('D', '3', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFullHouse(fullHouseHand)).toBeTruthy()
//   })
//   it('should return [false] for a flush hand', () => {
//     const flushHand: Card[] = [
//       new Card('D', '10', mockRankStrategy),
//       new Card('D', '4', mockRankStrategy),
//       new Card('D', '5', mockRankStrategy),
//       new Card('D', 'J', mockRankStrategy),
//       new Card('D', 'Q', mockRankStrategy),
//       new Card('S', 'A', mockRankStrategy),
//       new Card('C', '9', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFullHouse(flushHand)).toBeFalsy()
//   })
//   it('should return [false] for a straight hand', () => {
//     const straightHand: Card[] = [
//       new Card('S', '2', mockRankStrategy),
//       new Card('D', '3', mockRankStrategy),
//       new Card('S', '4', mockRankStrategy),
//       new Card('S', '5', mockRankStrategy),
//       new Card('S', '6', mockRankStrategy),
//       new Card('H', '9', mockRankStrategy),
//       new Card('H', 'K', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFullHouse(straightHand)).toBeFalsy()
//   })
//   it('should return [false] for a three-of-a-kind hand', () => {
//     const threeOfAKindHand: Card[] = [
//       new Card('S', 'A', mockRankStrategy),
//       new Card('D', 'A', mockRankStrategy),
//       new Card('C', 'A', mockRankStrategy),
//       new Card('S', '3', mockRankStrategy),
//       new Card('H', '5', mockRankStrategy),
//       new Card('D', '7', mockRankStrategy),
//       new Card('D', '9', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFullHouse(threeOfAKindHand)).toBeFalsy()
//   })
//   it('should return [false] for a two-pair hand', () => {
//     const twoPairHand: Card[] = [
//       new Card('S', '4', mockRankStrategy),
//       new Card('D', '4', mockRankStrategy),
//       new Card('C', '6', mockRankStrategy),
//       new Card('D', '6', mockRankStrategy),
//       new Card('H', '9', mockRankStrategy),
//       new Card('C', '10', mockRankStrategy),
//       new Card('S', 'K', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFullHouse(twoPairHand)).toBeFalsy()
//   })
//   it('should return [false] for a one-pair hand', () => {
//     const onePairHand: Card[] = [
//       new Card('H', '10', mockRankStrategy),
//       new Card('C', '10', mockRankStrategy),
//       new Card('S', '3', mockRankStrategy),
//       new Card('D', '4', mockRankStrategy),
//       new Card('S', 'A', mockRankStrategy),
//       new Card('C', '8', mockRankStrategy),
//       new Card('C', 'Q', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFullHouse(onePairHand)).toBeFalsy()
//   })
//   it('should return [false] for a high-card hand', () => {
//     const highCardHand: Card[] = [
//       new Card('C', '2', mockRankStrategy),
//       new Card('C', '4', mockRankStrategy),
//       new Card('S', '6', mockRankStrategy),
//       new Card('D', '8', mockRankStrategy),
//       new Card('H', '9', mockRankStrategy),
//       new Card('H', 'J', mockRankStrategy),
//       new Card('C', 'Q', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFullHouse(highCardHand)).toBeFalsy()
//   })
// })

// describe('isStraight', () => {
//   it('should return [true] for a royal-flush hand', () => {
//     const royalFlushHand: Card[] = [
//       new Card('C', 'A', mockRankStrategy),
//       new Card('C', '10', mockRankStrategy),
//       new Card('C', 'J', mockRankStrategy),
//       new Card('C', 'Q', mockRankStrategy),
//       new Card('C', 'K', mockRankStrategy),
//       new Card('D', '3', mockRankStrategy),
//       new Card('D', '10', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraight(royalFlushHand)).toBeTruthy()
//   })
//   it('should return [true] for a straight-flush hand', () => {
//     const straightFlushHand: Card[] = [
//       new Card('C', '4', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('C', '6', mockRankStrategy),
//       new Card('C', '7', mockRankStrategy),
//       new Card('C', '8', mockRankStrategy),
//       new Card('C', 'A', mockRankStrategy),
//       new Card('H', 'A', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraight(straightFlushHand)).toBeTruthy()
//   })
//   it('should return [false] for a four-of-a-kind hand', () => {
//     const fourOfAKindHand: Card[] = [
//       new Card('H', '5', mockRankStrategy),
//       new Card('D', '5', mockRankStrategy),
//       new Card('S', '5', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('H', '8', mockRankStrategy),
//       new Card('D', '8', mockRankStrategy),
//       new Card('S', '10', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraight(fourOfAKindHand)).toBeFalsy()
//   })
//   it('should return [false] for a full-house hand', () => {
//     const fullHouseHand: Card[] = [
//       new Card('S', '3', mockRankStrategy),
//       new Card('D', '3', mockRankStrategy),
//       new Card('H', '3', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('S', '5', mockRankStrategy),
//       new Card('S', '7', mockRankStrategy),
//       new Card('C', '10', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraight(fullHouseHand)).toBeFalsy()
//   })
//   it('should return [false] for a flush hand', () => {
//     const flushHand: Card[] = [
//       new Card('H', '2', mockRankStrategy),
//       new Card('H', '5', mockRankStrategy),
//       new Card('H', '7', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy),
//       new Card('H', 'Q', mockRankStrategy),
//       new Card('D', '9', mockRankStrategy),
//       new Card('C', 'J', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraight(flushHand)).toBeFalsy()
//   })
//   it('should return [true] for a straight hand (without A)', () => {
//     const straightHandWithoutA: Card[] = [
//       new Card('S', '5', mockRankStrategy),
//       new Card('D', '6', mockRankStrategy),
//       new Card('H', '7', mockRankStrategy),
//       new Card('C', '8', mockRankStrategy),
//       new Card('S', '9', mockRankStrategy),
//       new Card('H', 'J', mockRankStrategy),
//       new Card('D', 'K', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraight(straightHandWithoutA)).toBeTruthy()
//   })
//   it('should return [true] for a straight hand (with A)', () => {
//     const straightHandWithA: Card[] = [
//       new Card('D', 'A', mockRankStrategy),
//       new Card('D', '2', mockRankStrategy),
//       new Card('D', '3', mockRankStrategy),
//       new Card('S', '4', mockRankStrategy),
//       new Card('S', '5', mockRankStrategy),
//       new Card('C', '8', mockRankStrategy),
//       new Card('H', 'K', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraight(straightHandWithA)).toBeTruthy()
//   })
//   it('should return [false] for a three-of-a-kind hand', () => {
//     const threeOfAKindHand: Card[] = [
//       new Card('D', '4', mockRankStrategy),
//       new Card('S', '4', mockRankStrategy),
//       new Card('C', '4', mockRankStrategy),
//       new Card('H', '8', mockRankStrategy),
//       new Card('H', '9', mockRankStrategy),
//       new Card('S', 'J', mockRankStrategy),
//       new Card('D', 'Q', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraight(threeOfAKindHand)).toBeFalsy()
//   })
//   it('should return [false] for a two-pair hand', () => {
//     const twoPairHand: Card[] = [
//       new Card('D', '10', mockRankStrategy),
//       new Card('S', '10', mockRankStrategy),
//       new Card('H', 'J', mockRankStrategy),
//       new Card('D', 'J', mockRankStrategy),
//       new Card('H', '4', mockRankStrategy),
//       new Card('D', '6', mockRankStrategy),
//       new Card('C', '9', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraight(twoPairHand)).toBeFalsy()
//   })
//   it('should return [false] for a one-pair hand', () => {
//     const onePairHand: Card[] = [
//       new Card('S', '9', mockRankStrategy),
//       new Card('D', '9', mockRankStrategy),
//       new Card('S', '3', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('C', '7', mockRankStrategy),
//       new Card('S', 'Q', mockRankStrategy),
//       new Card('H', 'A', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraight(onePairHand)).toBeFalsy()
//   })
//   it('should return [false] for a high-card hand', () => {
//     const highCardHand: Card[] = [
//       new Card('D', '2', mockRankStrategy),
//       new Card('H', '4', mockRankStrategy),
//       new Card('C', '6', mockRankStrategy),
//       new Card('S', '7', mockRankStrategy),
//       new Card('S', '9', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy),
//       new Card('C', 'J', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isStraight(highCardHand)).toBeFalsy()
//   })
// })

// describe('isFlush', () => {
//   it('should return [true] for a royal-flush hand', () => {
//     const royalFlushHand: Card[] = [
//       new Card('S', '10', mockRankStrategy),
//       new Card('S', 'J', mockRankStrategy),
//       new Card('S', 'Q', mockRankStrategy),
//       new Card('S', 'K', mockRankStrategy),
//       new Card('S', 'A', mockRankStrategy),
//       new Card('H', '6', mockRankStrategy),
//       new Card('C', '8', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFlush(royalFlushHand)).toBeTruthy()
//   })
//   it('should return [true] for a straight-flush hand', () => {
//     const straightFlushHand: Card[] = [
//       new Card('C', '9', mockRankStrategy),
//       new Card('C', '10', mockRankStrategy),
//       new Card('C', 'J', mockRankStrategy),
//       new Card('C', 'Q', mockRankStrategy),
//       new Card('C', 'K', mockRankStrategy),
//       new Card('H', '2', mockRankStrategy),
//       new Card('H', '4', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFlush(straightFlushHand)).toBeTruthy()
//   })
//   it('should return [false] for a four-of-a-kind hand', () => {
//     const fourOfAKindHand: Card[] = [
//       new Card('S', '5', mockRankStrategy),
//       new Card('H', '5', mockRankStrategy),
//       new Card('D', '5', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('H', '3', mockRankStrategy),
//       new Card('S', '9', mockRankStrategy),
//       new Card('D', 'K', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFlush(fourOfAKindHand)).toBeFalsy()
//   })
//   it('should return [false] for a full-house hand', () => {
//     const fullHouseHand: Card[] = [
//       new Card('S', '2', mockRankStrategy),
//       new Card('D', '2', mockRankStrategy),
//       new Card('H', '2', mockRankStrategy),
//       new Card('C', 'K', mockRankStrategy),
//       new Card('H', 'K', mockRankStrategy),
//       new Card('S', '9', mockRankStrategy),
//       new Card('D', '10', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFlush(fullHouseHand)).toBeFalsy()
//   })
//   it('should return [true] for a flush hand', () => {
//     const flushHand: Card[] = [
//       new Card('D', '2', mockRankStrategy),
//       new Card('D', '4', mockRankStrategy),
//       new Card('D', '5', mockRankStrategy),
//       new Card('D', '10', mockRankStrategy),
//       new Card('D', 'K', mockRankStrategy),
//       new Card('D', '6', mockRankStrategy),
//       new Card('H', '2', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFlush(flushHand)).toBeTruthy()
//   })
//   it('should return [false] for a straight hand', () => {
//     const straightHand: Card[] = [
//       new Card('D', '2', mockRankStrategy),
//       new Card('H', '3', mockRankStrategy),
//       new Card('S', '4', mockRankStrategy),
//       new Card('S', '5', mockRankStrategy),
//       new Card('C', '6', mockRankStrategy),
//       new Card('S', '10', mockRankStrategy),
//       new Card('H', '3', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFlush(straightHand)).toBeFalsy()
//   })
//   it('should return [false] for a three-of-a-kind hand', () => {
//     const threeOfAKindHand: Card[] = [
//       new Card('S', '4', mockRankStrategy),
//       new Card('H', '4', mockRankStrategy),
//       new Card('D', '4', mockRankStrategy),
//       new Card('S', '10', mockRankStrategy),
//       new Card('C', 'K', mockRankStrategy),
//       new Card('C', '9', mockRankStrategy),
//       new Card('H', '8', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFlush(threeOfAKindHand)).toBeFalsy()
//   })
//   it('should return [false] for a two-pair hand', () => {
//     const twoPairHand: Card[] = [
//       new Card('S', '9', mockRankStrategy),
//       new Card('H', '9', mockRankStrategy),
//       new Card('D', 'A', mockRankStrategy),
//       new Card('S', 'A', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('C', '8', mockRankStrategy),
//       new Card('D', 'J', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFlush(twoPairHand)).toBeFalsy()
//   })
//   it('should return [false] for a one-pair hand', () => {
//     const onePairHand: Card[] = [
//       new Card('C', '3', mockRankStrategy),
//       new Card('S', '3', mockRankStrategy),
//       new Card('S', '2', mockRankStrategy),
//       new Card('D', '8', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy),
//       new Card('D', 'A', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFlush(onePairHand)).toBeFalsy()
//   })
//   it('should return [false] for a high-card hand', () => {
//     const highCardHand: Card[] = [
//       new Card('S', 'A', mockRankStrategy),
//       new Card('H', '3', mockRankStrategy),
//       new Card('H', '6', mockRankStrategy),
//       new Card('C', '7', mockRankStrategy),
//       new Card('D', '10', mockRankStrategy),
//       new Card('D', 'Q', mockRankStrategy),
//       new Card('S', 'K', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isFlush(highCardHand)).toBeFalsy()
//   })
// })

// describe('isThreeOfAKind', () => {
//   it('should return false for a royal-flush hand', () => {
//     const royalFlushHand: Card[] = [
//       new Card('H', '10', mockRankStrategy),
//       new Card('H', 'J', mockRankStrategy),
//       new Card('H', 'Q', mockRankStrategy),
//       new Card('H', 'K', mockRankStrategy),
//       new Card('H', 'A', mockRankStrategy),
//       new Card('C', '4', mockRankStrategy),
//       new Card('D', '7', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isThreeOfAKind(royalFlushHand)).toBeFalsy()
//   })
//   it('should return false for a straight-flush hand', () => {
//     const straightFlushHand: Card[] = [
//       new Card('D', '3', mockRankStrategy),
//       new Card('D', '4', mockRankStrategy),
//       new Card('D', '5', mockRankStrategy),
//       new Card('D', '6', mockRankStrategy),
//       new Card('D', '7', mockRankStrategy),
//       new Card('S', 'K', mockRankStrategy),
//       new Card('C', '10', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isThreeOfAKind(straightFlushHand)).toBeFalsy()
//   })
//   it('should return true for a four-of-a-kind hand', () => {
//     const fourOfAKindHand: Card[] = [
//       new Card('H', '5', mockRankStrategy),
//       new Card('S', '5', mockRankStrategy),
//       new Card('D', '5', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('S', 'K', mockRankStrategy),
//       new Card('D', '2', mockRankStrategy),
//       new Card('H', 'A', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isThreeOfAKind(fourOfAKindHand)).toBeTruthy()
//   })
//   it('should return true for a full-house hand', () => {
//     const fullHouseHand: Card[] = [
//       new Card('H', '8', mockRankStrategy),
//       new Card('S', '8', mockRankStrategy),
//       new Card('D', '8', mockRankStrategy),
//       new Card('C', 'J', mockRankStrategy),
//       new Card('S', 'J', mockRankStrategy),
//       new Card('D', '10', mockRankStrategy),
//       new Card('C', '2', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isThreeOfAKind(fullHouseHand)).toBeTruthy()
//   })
//   it('should return false for a flush hand', () => {
//     const flushHand: Card[] = [
//       new Card('D', '3', mockRankStrategy),
//       new Card('D', '7', mockRankStrategy),
//       new Card('D', 'Q', mockRankStrategy),
//       new Card('D', '10', mockRankStrategy),
//       new Card('D', '5', mockRankStrategy),
//       new Card('S', '9', mockRankStrategy),
//       new Card('C', '4', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isThreeOfAKind(flushHand)).toBeFalsy()
//   })
//   it('should return false for a straight hand', () => {
//     const straightHand: Card[] = [
//       new Card('D', '9', mockRankStrategy),
//       new Card('S', '10', mockRankStrategy),
//       new Card('S', 'J', mockRankStrategy),
//       new Card('C', 'Q', mockRankStrategy),
//       new Card('H', 'K', mockRankStrategy),
//       new Card('S', '2', mockRankStrategy),
//       new Card('H', '6', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isThreeOfAKind(straightHand)).toBeFalsy()
//   })
//   it('should return true for a three-of-a-kind hand', () => {
//     const threeOfAKindHand: Card[] = [
//       new Card('C', '10', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy),
//       new Card('S', '10', mockRankStrategy),
//       new Card('S', '3', mockRankStrategy),
//       new Card('S', '2', mockRankStrategy),
//       new Card('S', 'A', mockRankStrategy),
//       new Card('D', 'J', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isThreeOfAKind(threeOfAKindHand)).toBeTruthy()
//   })
//   it('should return false for a two-pair hand', () => {
//     const twoPairHand: Card[] = [
//       new Card('D', 'K', mockRankStrategy),
//       new Card('S', 'K', mockRankStrategy),
//       new Card('H', '6', mockRankStrategy),
//       new Card('C', '6', mockRankStrategy),
//       new Card('H', '3', mockRankStrategy),
//       new Card('D', '9', mockRankStrategy),
//       new Card('D', '10', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isThreeOfAKind(twoPairHand)).toBeFalsy()
//   })
//   it('should return false for a one-pair hand', () => {
//     const onePairHand: Card[] = [
//       new Card('D', 'K', mockRankStrategy),
//       new Card('S', 'K', mockRankStrategy),
//       new Card('D', '4', mockRankStrategy),
//       new Card('D', '10', mockRankStrategy),
//       new Card('H', 'A', mockRankStrategy),
//       new Card('D', '7', mockRankStrategy),
//       new Card('C', '3', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isThreeOfAKind(onePairHand)).toBeFalsy()
//   })
//   it('should return false for a high-card hand', () => {
//     const highCardHand: Card[] = [
//       new Card('D', 'A', mockRankStrategy),
//       new Card('C', '4', mockRankStrategy),
//       new Card('D', 'K', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy),
//       new Card('H', 'Q', mockRankStrategy),
//       new Card('S', '6', mockRankStrategy),
//       new Card('C', '2', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isThreeOfAKind(highCardHand)).toBeFalsy()
//   })
// })

// describe('isTwoPair', () => {
//   it('should return false for a royal-flush hand', () => {
//     const royalFlushHand: Card[] = [
//       new Card('C', '10', mockRankStrategy),
//       new Card('C', 'J', mockRankStrategy),
//       new Card('C', 'Q', mockRankStrategy),
//       new Card('C', 'K', mockRankStrategy),
//       new Card('C', 'A', mockRankStrategy),
//       new Card('S', '4', mockRankStrategy),
//       new Card('D', '7', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isTwoPair(royalFlushHand)).toBeFalsy()
//   })
//   it('should return false for a straight-flush hand', () => {
//     const straightFlushHand: Card[] = [
//       new Card('D', '6', mockRankStrategy),
//       new Card('D', '7', mockRankStrategy),
//       new Card('D', '8', mockRankStrategy),
//       new Card('D', '9', mockRankStrategy),
//       new Card('D', '10', mockRankStrategy),
//       new Card('S', 'K', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isTwoPair(straightFlushHand)).toBeFalsy()
//   })
//   it('should return false for a four-of-a-kind hand', () => {
//     const fourOfAKindHand: Card[] = [
//       new Card('H', '5', mockRankStrategy),
//       new Card('S', '5', mockRankStrategy),
//       new Card('D', '5', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('S', 'K', mockRankStrategy),
//       new Card('D', '2', mockRankStrategy),
//       new Card('H', 'A', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isTwoPair(fourOfAKindHand)).toBeFalsy()
//   })
//   it('should return true for a full-house hand', () => {
//     const fullHouseHand: Card[] = [
//       new Card('H', '8', mockRankStrategy),
//       new Card('S', '8', mockRankStrategy),
//       new Card('D', '8', mockRankStrategy),
//       new Card('C', 'J', mockRankStrategy),
//       new Card('S', 'J', mockRankStrategy),
//       new Card('D', '10', mockRankStrategy),
//       new Card('C', '2', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isTwoPair(fullHouseHand)).toBeTruthy()
//   })
//   it('should return false for a flush hand', () => {
//     const flushHand: Card[] = [
//       new Card('D', '3', mockRankStrategy),
//       new Card('D', '7', mockRankStrategy),
//       new Card('D', 'Q', mockRankStrategy),
//       new Card('D', '10', mockRankStrategy),
//       new Card('D', '5', mockRankStrategy),
//       new Card('S', '9', mockRankStrategy),
//       new Card('C', '4', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isTwoPair(flushHand)).toBeFalsy()
//   })
//   it('should return false for a straight hand', () => {
//     const straightHand: Card[] = [
//       new Card('D', '2', mockRankStrategy),
//       new Card('S', '3', mockRankStrategy),
//       new Card('S', '4', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('H', '6', mockRankStrategy),
//       new Card('S', '2', mockRankStrategy),
//       new Card('C', '10', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isTwoPair(straightHand)).toBeFalsy()
//   })
//   it('should return false for a three-of-a-kind hand', () => {
//     const threeOfAKindHand: Card[] = [
//       new Card('D', '5', mockRankStrategy),
//       new Card('S', '5', mockRankStrategy),
//       new Card('C', '5', mockRankStrategy),
//       new Card('D', '3', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy),
//       new Card('S', 'Q', mockRankStrategy),
//       new Card('D', 'J', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isTwoPair(threeOfAKindHand)).toBeFalsy()
//   })
//   it('should return true for a two-pair hand', () => {
//     const twoPairHand: Card[] = [
//       new Card('S', 'K', mockRankStrategy),
//       new Card('D', 'K', mockRankStrategy),
//       new Card('C', 'J', mockRankStrategy),
//       new Card('H', 'J', mockRankStrategy),
//       new Card('D', '7', mockRankStrategy),
//       new Card('H', 'A', mockRankStrategy),
//       new Card('S', '2', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isTwoPair(twoPairHand)).toBeTruthy()
//   })
//   it('should return false for a one-pair hand', () => {
//     const onePairHand: Card[] = [
//       new Card('H', 'Q', mockRankStrategy),
//       new Card('C', 'Q', mockRankStrategy),
//       new Card('C', 'K', mockRankStrategy),
//       new Card('D', '10', mockRankStrategy),
//       new Card('D', '5', mockRankStrategy),
//       new Card('H', '4', mockRankStrategy),
//       new Card('S', '6', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isTwoPair(onePairHand)).toBeFalsy()
//   })
//   it('should return false for a high-card hand', () => {
//     const highCardHand: Card[] = [
//       new Card('H', 'A', mockRankStrategy),
//       new Card('S', 'Q', mockRankStrategy),
//       new Card('H', '10', mockRankStrategy),
//       new Card('D', '8', mockRankStrategy),
//       new Card('C', '6', mockRankStrategy),
//       new Card('D', '9', mockRankStrategy),
//       new Card('S', '3', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isTwoPair(highCardHand)).toBeFalsy()
//   })
// })

// describe('isOnePair', () => {
//   it('should return true for a one-pair hand', () => {
//     const handWithOnePair: Card[] = [
//       new Card('S', '2', mockRankStrategy),
//       new Card('D', '2', mockRankStrategy),
//       new Card('H', '4', mockRankStrategy),
//       new Card('C', 'J', mockRankStrategy),
//       new Card('S', '5', mockRankStrategy),
//       new Card('D', '3', mockRankStrategy),
//       new Card('H', '8', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isOnePair(handWithOnePair)).toBeTruthy()
//   })
//   it('should return false for a high-card hand', () => {
//     const highCardHand: Card[] = [
//       new Card('S', '2', mockRankStrategy),
//       new Card('H', '4', mockRankStrategy),
//       new Card('S', 'A', mockRankStrategy),
//       new Card('C', 'J', mockRankStrategy),
//       new Card('S', '5', mockRankStrategy),
//       new Card('D', '3', mockRankStrategy),
//       new Card('H', '8', mockRankStrategy),
//       new Card('C', 'K', mockRankStrategy)
//     ]
//     expect(PokerHandEvaluator.isOnePair(highCardHand)).toBeFalsy()
//   })
// })
