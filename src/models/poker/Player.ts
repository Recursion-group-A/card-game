import Card from '@/models/common/Card'
import Hand from '@/models/common/Hand'
import { PLAYERTYPE } from '@/types/playerTypes'

export default class Player {
  private readonly playerType: PLAYERTYPE

  private hand: Hand

  private chips: number

  private bet: number

  private isDealer: boolean

  private isActive: boolean

  constructor() {
    this.playerType = 'player'
    this.hand = new Hand()
    this.chips = 1000
    this.bet = 0
    this.isDealer = false
    this.isActive = true
  }

  public getPlayerType(): PLAYERTYPE {
    return this.playerType
  }

  public getHand(): Card[] {
    return this.hand.getHand()
  }

  public getChips(): number {
    return this.chips
  }

  public getBet(): number {
    return this.bet
  }

  public getIsDealer(): boolean {
    return this.isDealer
  }

  public getIsActive(): boolean {
    return this.isActive
  }

  public addHand(card: Card): void {
    this.hand.addOne(card)
  }

  public addChips(amount: number): void {
    this.chips += amount
  }

  public clearHand(): void {
    this.hand = new Hand()
  }

  public resetBet(): void {
    this.bet = 0
  }

  public placeBet(amount: number): number {
    // TODO: チップとベットの額の判定の処理
    if (amount > this.chips) {
      throw new Error(
        `Not enough chips to place the bet. Available: ${this.chips}, Tried to bet: ${amount}`
      )
    }

    this.chips -= amount
    this.bet += amount
    return amount
  }

  public setAsDealer(bool: boolean): void {
    this.isDealer = bool
  }

  public setAsActive(bool: boolean): void {
    this.isActive = bool
  }
}
