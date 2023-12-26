import Card from '@/models/common/Card'
import Hand from '@/models/common/Hand'
import PlayerTypes from '@/types/common/player-types'

export default abstract class Player<H extends Hand> {
  protected readonly _playerType: PlayerTypes

  protected readonly _playerName: string

  protected _hand: H

  protected _chips: number

  protected _bet: number

  protected constructor(playerType: PlayerTypes, playerName: string) {
    this._playerType = playerType
    this._playerName = playerName
    this._hand = this.generateHand()
    this._chips = 1000
    this._bet = 0
  }

  public addHand(card: Card): void {
    this._hand.addOne(card)
  }

  public resetHand(): void {
    this._hand.resetHand()
  }

  public addChips(amount: number): void {
    if (amount < 0) {
      throw new Error('Cannot add a negative amount of chips')
    }
    this.chips = this._chips + amount
  }

  public subtractChips(amount: number): void {
    if (amount > this.chips) {
      throw new Error('Chip amount exceeds current chips')
    }
    this.chips = this._chips - amount
  }

  public addBet(amount: number): void {
    if (amount < 0) {
      throw new Error('Cannot add a negative amount of bet')
    }
    this.bet = this._bet + amount
  }

  public subtractBet(amount: number): void {
    if (amount > this.bet) {
      throw new Error('Bet amount exceeds current bet')
    }
    this.bet = this._bet - amount
  }

  public placeBet(amount: number): void {
    this.subtractChips(amount)
    this.addBet(amount)
  }

  public resetBet(): void {
    this.bet = 0
  }

  protected abstract generateHand(): H

  get playerType(): PlayerTypes {
    return this._playerType
  }

  get playerName(): string {
    return this._playerName
  }

  get hand(): H {
    return this._hand
  }

  get chips(): number {
    return this._chips
  }

  set chips(chipAmount: number) {
    if (chipAmount < 0) {
      throw new Error('Chip amount cannot be negative')
    }
    this._chips = chipAmount
  }

  get bet(): number {
    return this._bet
  }

  set bet(betAmount: number) {
    if (betAmount < 0) {
      throw new Error('Bet amount cannot be negative')
    }
    this._bet = betAmount
  }
}
