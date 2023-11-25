import Card from '@/models/common/Card'
import { Suit } from '@/types/suits'
import { Rank } from '@/types/ranks'
import { RankStrategy } from '@/models/common/RankStrategy'
import PokerRankStrategy from '@/models/poker/PokerRankStrategy'
import BlackjackRankStrategy from '@/models/blackjack/BlackjackRankStrategy'

// RankStrategyのモックを作成
const mockRankStrategy: RankStrategy = {
  getRankNumber: jest.fn().mockReturnValue(0)
}

describe('getSuit', () => {
  it.each([
    ['H', 'H'],
    ['S', 'S'],
    ['D', 'D'],
    ['C', 'C']
  ])('should return %s as %s', (suit, expected) => {
    const card: Card = new Card(suit as Suit, 'A', mockRankStrategy)
    expect(card.getSuit()).toBe(expected)
  })
  it('should return undefined', () => {
    const card: Card = new Card(undefined, 'Joker', mockRankStrategy)
    expect(card.getSuit()).toBeUndefined()
  })
})

describe('getRank', () => {
  it.each([
    ['2', '2'],
    ['3', '3'],
    ['4', '4'],
    ['5', '5'],
    ['6', '6'],
    ['7', '7'],
    ['8', '8'],
    ['9', '9'],
    ['10', '10'],
    ['J', 'J'],
    ['Q', 'Q'],
    ['K', 'K'],
    ['A', 'A'],
    ['Joker', 'Joker']
  ])('should return %s as %s', (rank, expected) => {
    const card: Card = new Card('H', rank as Rank, mockRankStrategy)
    expect(card.getRank()).toBe(expected)
  })
})

describe('PokerRankStrategy', () => {
  const pokerRankStrategy = new PokerRankStrategy()

  it.each([
    ['2', 2],
    ['3', 3],
    ['4', 4],
    ['5', 5],
    ['6', 6],
    ['7', 7],
    ['8', 8],
    ['9', 9],
    ['10', 10],
    ['J', 11],
    ['Q', 12],
    ['K', 13],
    ['A', 14],
    ['Joker', 0]
  ])('should return %s as %i', (rank, expected) => {
    expect(pokerRankStrategy.getRankNumber(rank as Rank)).toBe(expected)
  })
})

describe('BlackjackRankStrategy', () => {
  const blackjackRankStrategy = new BlackjackRankStrategy()

  it.each([
    ['2', 2],
    ['3', 3],
    ['4', 4],
    ['5', 5],
    ['6', 6],
    ['7', 7],
    ['8', 8],
    ['9', 9],
    ['10', 10],
    ['J', 10],
    ['Q', 10],
    ['K', 10],
    ['A', 1],
    ['Joker', 0]
  ])('should return %s as %i', (rank, expected) => {
    expect(blackjackRankStrategy.getRankNumber(rank as Rank)).toBe(expected)
  })
})

describe('createJoker', () => {
  it('should create a Joker with correct properties', () => {
    const jokerCard: Card = Card.createJoker(mockRankStrategy)

    expect(jokerCard).toBeInstanceOf(Card)
    expect(jokerCard.getSuit()).toBeUndefined()
    expect(jokerCard.getRank()).toBe('Joker')
    expect(jokerCard.getRankNumber()).toBe(0)
  })
})
