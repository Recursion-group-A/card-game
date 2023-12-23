import Card from '@/models/common/Card'
import { Suit } from '@/types/common/suits'
import { Rank } from '@/types/common/ranks'
import { SUITS, RANKS } from '@/constants/cards'
import { GAMETYPE, GAMESWITHJOKER } from '@/types/common/gameTypes'
import { RankStrategy } from '@/models/common/RankStrategy'
import { getRankStrategy } from '@/utils/utils'

export default class Deck {
  private readonly _gameType: GAMETYPE

  private readonly _rankStrategy: RankStrategy

  private _deck: Card[]

  constructor(gameType: GAMETYPE) {
    this._gameType = gameType
    this._rankStrategy = getRankStrategy(gameType)
    this._deck = this.generateDeck(GAMESWITHJOKER.includes(gameType))
  }

  public generateDeck(addJoker: boolean = false): Card[] {
    const newDeck: Card[] = []

    SUITS.forEach((suit: Suit) => {
      RANKS.forEach((rank: Rank) => {
        newDeck.push(new Card(suit, rank, this._rankStrategy))
      })
    })

    if (addJoker) {
      newDeck.push(Card.createJoker(this._rankStrategy))
      newDeck.push(Card.createJoker(this._rankStrategy))
    }
    return newDeck
  }

  public shuffle(): void {
    this.performShuffle()
  }

  public resetDeck(): void {
    this._deck = this.generateDeck(GAMESWITHJOKER.includes(this._gameType))
    this.shuffle()
  }

  public drawOne(): Card | undefined {
    return this._deck.shift()
  }

  public getDeckSize(): number {
    return this._deck.length
  }

  public getCardAt(index: number): Card {
    return this._deck[index]
  }

  private performShuffle(): void {
    for (let i: number = this._deck.length - 1; i >= 0; i -= 1) {
      const j: number = Math.floor(Math.random() * (i + 1))
      ;[this._deck[i], this._deck[j]] = [this._deck[j], this._deck[i]]
    }
  }

  get gameType(): GAMETYPE {
    return this._gameType
  }

  get rankStrategy(): RankStrategy {
    return this._rankStrategy
  }
}
