import Card from '@/models/common/Card'
import Deck from '@/models/common/Deck'
import { SUITS } from '@/constants/cards/suits.constants'
import { RANKS } from '@/constants/cards/ranks.constants'
import { GAMESWITHJOKER, GameTypes } from '@/types/common/game-types'
import { getRankStrategy } from '@/utils/utils'

describe('Deck constructor', () => {
  it('should create a Poker-Deck instance with correct properties', () => {
    const deck: Deck = new Deck(GameTypes.Poker)

    expect(deck).toBeInstanceOf(Deck)
    expect(deck.gameType).toBe(GameTypes.Poker)
    expect(deck.rankStrategy).toStrictEqual(getRankStrategy(GameTypes.Poker))
    expect(GAMESWITHJOKER.includes(deck.gameType)).toBeFalsy()
  })
  it('should create a Blackjack-Deck instance with correct properties', () => {
    const deck: Deck = new Deck(GameTypes.Blackjack)

    expect(deck).toBeInstanceOf(Deck)
    expect(deck.gameType).toBe(GameTypes.Blackjack)
    expect(deck.rankStrategy).toStrictEqual(
      getRankStrategy(GameTypes.Blackjack)
    )
    expect(GAMESWITHJOKER.includes(deck.gameType)).toBeFalsy()
  })
  it('should create a Speed-Deck instance with correct properties', () => {
    const deck: Deck = new Deck(GameTypes.Speed)

    expect(deck).toBeInstanceOf(Deck)
    expect(deck.gameType).toBe(GameTypes.Speed)
    expect(deck.rankStrategy).toStrictEqual(getRankStrategy(GameTypes.Speed))
    expect(GAMESWITHJOKER.includes(deck.gameType)).toBeTruthy()
  })
})

describe('generateDeck', () => {
  const speedDeck: Deck = new Deck(GameTypes.Speed)
  const blackjackDeck: Deck = new Deck(GameTypes.Blackjack)
  const pokerDeck: Deck = new Deck(GameTypes.Poker)

  const combinations = SUITS.flatMap((suit) =>
    RANKS.map((rank) => [suit, rank])
  )

  it('should create a deck which length is 52', () => {
    const expectedSize: number = SUITS.length * RANKS.length

    expect(blackjackDeck.getDeckSize()).toBe(expectedSize)
    expect(pokerDeck.getDeckSize()).toBe(expectedSize)
  })
  it('should create a deck which length is 54', () => {
    const expectedSize: number = SUITS.length * RANKS.length + 2

    expect(speedDeck.getDeckSize()).toBe(expectedSize)
    expect(
      speedDeck.generateDeck(true).filter((card) => card.rank === 'Joker')
        .length
    ).toBe(2)
  })
  it.each(combinations)(
    'include a card of suit %s and rank %s regardless of addJoker value',
    (suit, rank) => {
      const generatedDeckWithJoker = speedDeck.generateDeck()
      const generatedDeckWithoutJoker = blackjackDeck.generateDeck()

      const foundCardWithJoker = generatedDeckWithJoker.find(
        (card) => card.suit === suit && card.rank === rank
      )
      const foundCardWithoutJoker = generatedDeckWithoutJoker.find(
        (card) => card.suit === suit && card.rank === rank
      )

      expect(foundCardWithJoker).toBeDefined()
      expect(foundCardWithoutJoker).toBeDefined()
    }
  )
})

describe('performShuffle', () => {
  const deck: Deck = new Deck(GameTypes.Poker)

  it('should change the order of cards in the deck', () => {
    const originalDeck: Card[] = deck.generateDeck()
    const copyDeck: Card[] = [...originalDeck]
    deck.shuffle()

    const isOrderChanged: boolean = copyDeck.some(
      (card: Card, index: number): boolean => card !== deck.getCardAt(index)
    )
    expect(isOrderChanged).toBeTruthy()
  })
})

describe('drawOne', () => {
  it('should return a Card instance until 52 times call', () => {
    const deck: Deck = new Deck(GameTypes.Poker)

    for (let i = 0; i < deck.getDeckSize(); i += 1) {
      const card: Card | undefined = deck.drawOne()
      expect(card).toBeInstanceOf(Card)
    }
  })
  it('should return undefined after 52 times call', () => {
    const deck: Deck = new Deck(GameTypes.Poker)

    let times: number = deck.getDeckSize()
    while (times > 0) {
      deck.drawOne()
      times -= 1
    }
    const card: Card | undefined = deck.drawOne()
    expect(card).toBeUndefined()
  })
  it('should draw different cards on consecutive calls', () => {
    const deck: Deck = new Deck(GameTypes.Poker)
    const firstDraw: Card | undefined = deck.drawOne()
    const secondDraw: Card | undefined = deck.drawOne()

    expect(firstDraw).not.toBe(secondDraw)
  })
  it('should draw exactly one card from deck', () => {
    const deck: Deck = new Deck(GameTypes.Poker)
    const initialSize: number = deck.getDeckSize()

    deck.drawOne()

    expect(deck.getDeckSize()).toBe(initialSize - 1)
  })
})
