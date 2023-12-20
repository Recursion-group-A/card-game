import Card from '@/models/common/Card'
import Hand from '@/models/common/Hand'
import PLAYERTYPES from '@/types/playerTypes'
import PokerAction from '@/models/poker/PokerAction'
import PokerHand from '@/models/poker/PokerHand'

export default class Player {
  private readonly _playerType: PLAYERTYPES

  private readonly _playerName: string

  private _chips: number

  private _bet: number

  private _hand: Hand

  private _isActive: boolean

  private _lastAction: PokerAction

  private _bestHand: PokerHand | undefined

  constructor(playerType: PLAYERTYPES, playerName: string) {
    this._playerType = playerType
    this._playerName = playerName
    this._chips = 1000
    this._bet = 0
    this._hand = new Hand()
    this._isActive = true
    this._lastAction = PokerAction.NO_ACTION
  }

  get playerType(): PLAYERTYPES {
    return this._playerType
  }

  get playerName(): string {
    return this._playerName
  }

  get chips(): number {
    return this._chips
  }

  get bet(): number {
    return this._bet
  }

  get hand(): Hand {
    return this._hand
  }

  get isActive(): boolean {
    return this._isActive
  }

  set isActive(bool: boolean) {
    this._isActive = bool
  }

  get lastAction(): PokerAction {
    return this._lastAction
  }

  set lastAction(action: PokerAction) {
    this._lastAction = action
  }

  get bestHand(): PokerHand | undefined {
    return this._bestHand
  }

  set bestHand(bestHand: PokerHand | undefined) {
    this._bestHand = bestHand
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

  public isLastActionRaise(): boolean {
    return this._lastAction === PokerAction.RAISE
  }

  public placeBet(amount: number): number {
    if (amount > this.chips) {
      throw new Error(
        `Not enough chips to place the bet. Available: ${this.chips}, Tried to bet: ${amount}`
      )
    }
    this._chips -= amount
    this._bet += amount
    return amount
  }
}
