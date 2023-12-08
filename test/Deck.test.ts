import Card from '@/models/common/Card'
import Deck from '@/models/common/Deck'
import { RANKS, SUITS } from '@/constants/cards'
import { GAMESWITHJOKER, GAMETYPE } from '@/types/gameTypes'
import getRankStrategy from '@/utils/getRankStrategy'

describe('Deck constructor', () => {
  it('should create a Poker-Deck instance with correct properties', () => {
    const deck: Deck = new Deck(GAMETYPE.Poker)

    expect(deck).toBeInstanceOf(Deck)
    expect(deck.getGameType()).toBe(GAMETYPE.Poker)
    expect(deck.getRankStrategy()).toStrictEqual(
      getRankStrategy(GAMETYPE.Poker)
    )
    expect(GAMESWITHJOKER.includes(deck.getGameType())).toBeFalsy()
  })
  it('should create a Blackjack-Deck instance with correct properties', () => {
    const deck: Deck = new Deck(GAMETYPE.Blackjack)

    expect(deck).toBeInstanceOf(Deck)
    expect(deck.getGameType()).toBe(GAMETYPE.Blackjack)
    expect(deck.getRankStrategy()).toStrictEqual(
      getRankStrategy(GAMETYPE.Blackjack)
    )
    expect(GAMESWITHJOKER.includes(deck.getGameType())).toBeFalsy()
  })
  it('should create a Speed-Deck instance with correct properties', () => {
    const deck: Deck = new Deck(GAMETYPE.Speed)

    expect(deck).toBeInstanceOf(Deck)
    expect(deck.getGameType()).toBe(GAMETYPE.Speed)
    expect(deck.getRankStrategy()).toStrictEqual(
      getRankStrategy(GAMETYPE.Speed)
    )
    expect(GAMESWITHJOKER.includes(deck.getGameType())).toBeTruthy()
  })
})

describe('generateDeck', () => {
  const speedDeck: Deck = new Deck(GAMETYPE.Speed)
  const blackjackDeck: Deck = new Deck(GAMETYPE.Blackjack)
  const pokerDeck: Deck = new Deck(GAMETYPE.Poker)

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
  const deck: Deck = new Deck(GAMETYPE.Poker)

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
    const deck: Deck = new Deck(GAMETYPE.Poker)

    for (let i = 0; i < deck.getDeckSize(); i += 1) {
      const card: Card | undefined = deck.drawOne()
      expect(card).toBeInstanceOf(Card)
    }
  })
  it('should return undefined after 52 times call', () => {
    const deck: Deck = new Deck(GAMETYPE.Poker)

    let times: number = deck.getDeckSize()
    while (times > 0) {
      deck.drawOne()
      times -= 1
    }
    const card: Card | undefined = deck.drawOne()
    expect(card).toBeUndefined()
  })
  it('should draw different cards on consecutive calls', () => {
    const deck: Deck = new Deck(GAMETYPE.Poker)
    const firstDraw: Card | undefined = deck.drawOne()
    const secondDraw: Card | undefined = deck.drawOne()

    expect(firstDraw).not.toBe(secondDraw)
  })
  it('should draw exactly one card from deck', () => {
    const deck: Deck = new Deck(GAMETYPE.Poker)
    const initialSize: number = deck.getDeckSize()

    deck.drawOne()

    expect(deck.getDeckSize()).toBe(initialSize - 1)
  })
})
