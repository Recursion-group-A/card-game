import Card from '@/models/common/Card'
import Hand from '@/models/common/Hand'
import { PLAYERTYPE } from '@/types/playerTypes'

export default class Player {
  private readonly _playerType: PLAYERTYPE

  private _hand: Hand

  private _chips: number

  private _bet: number

  private _isDealer: boolean

  private _isActive: boolean

  constructor() {
    this._playerType = 'player'
    this._hand = new Hand()
    this._chips = 1000
    this._bet = 0
    this._isDealer = false
    this._isActive = true
  }

  get playerType(): PLAYERTYPE {
    return this._playerType
  }

  get hand(): Card[] {
    return this._hand.getHand()
  }

  get chips(): number {
    return this._chips
  }

  get bet(): number {
    return this._bet
  }

  get isDealer(): boolean {
    return this._isDealer
  }

  get isActive(): boolean {
    return this._isActive
  }

  public addHand(card: Card): void {
    this._hand.addOne(card)
  }

  public addChips(amount: number): void {
    this._chips += amount
  }

  public clearHand(): void {
    this._hand = new Hand()
  }

  public resetBet(): void {
    this._bet = 0
  }

  public placeBet(amount: number): number {
    // TODO: チップとベットの額の判定の処理
    if (amount > this.chips) {
      throw new Error(
        `Not enough chips to place the bet. Available: ${this.chips}, Tried to bet: ${amount}`
      )
    }

    this._chips -= amount
    this._bet += amount
    return amount
  }

  public setAsDealer(bool: boolean): void {
    this._isDealer = bool
  }

  public setAsActive(bool: boolean): void {
    this._isActive = bool
  }
}
