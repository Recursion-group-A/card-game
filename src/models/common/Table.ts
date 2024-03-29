import Card from '@/models/common/Card'
import Deck from '@/models/common/Deck'
import Hand from '@/models/common/Hand'
import Player from '@/models/common/Player'
import { GameTypes } from '@/types/common/game-types'

export default abstract class Table<T extends Player<H>, H extends Hand> {
  protected readonly _deck: Deck

  protected _players: T[]

  protected _isFirstGame: boolean

  protected constructor(gameType: GameTypes, numOfPlayers: number) {
    this._deck = new Deck(gameType)
    this._players = this.generatePlayers(numOfPlayers)
    this._isFirstGame = true

    this._deck.shuffle()
  }

  public drawCard(): Card {
    let card: Card | undefined = this.tryDrawOne()
    if (!card) {
      card = this.resetDeckAndDraw()
    }
    return card
  }

  public resetPlayersBet(): void {
    this.players.forEach((p: T) => p.resetBet())
  }

  protected abstract generatePlayers(numOfPlayers: number): T[]

  private resetDeckAndDraw(): Card {
    this.deck.resetDeck()
    const card: Card | undefined = this.tryDrawOne()
    if (!card) {
      throw new Error('Unable to draw a card after deck reset.')
    }
    return card
  }

  private tryDrawOne(): Card | undefined {
    return this.deck.drawOne()
  }

  get players(): T[] {
    return this._players
  }

  get deck(): Deck {
    return this._deck
  }

  get isFirstTime(): boolean {
    return this._isFirstGame
  }

  set isFirstTime(bool: boolean) {
    this._isFirstGame = bool
  }
}
