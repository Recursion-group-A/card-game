import Card from '@/models/common/Card'
import BlackjackHand from '@/models/blackjack/BlackjackHand'
import { ParticipantStatuses } from '@/types/blackjack/participant-status-types'

export default class House {
  private readonly _name: string = 'HOUSE'

  private readonly _hand: BlackjackHand

  private _status: ParticipantStatuses

  private _actionCompleted: boolean

  constructor() {
    this._hand = new BlackjackHand()
    this._status = ParticipantStatuses.Wait
    this._actionCompleted = false
  }

  public bust(): void {
    this._status = ParticipantStatuses.Bust
    this._actionCompleted = true
  }

  public stand(): void {
    this._status = ParticipantStatuses.Stand
    this._actionCompleted = true
  }

  public blackjack(): void {
    this._status = ParticipantStatuses.Blackjack
    this._actionCompleted = true
  }

  public isBlackjack(): boolean {
    return this.hand.isBlackjack()
  }

  public prepareForNextRound(): void {
    this.initializeHand()
    this.initializeStates()
  }

  private initializeHand(): void {
    this._hand.resetHand()
  }

  private initializeStates(): void {
    this._status = ParticipantStatuses.Wait
  }

  public getHandTotalScore(): number {
    return this._hand.calculateBlackjackTotal()
  }

  public addHand(card: Card): void {
    this._hand.addOne(card)
  }

  get name(): string {
    return this._name
  }

  get status(): ParticipantStatuses {
    return this._status
  }

  get hand(): BlackjackHand {
    return this._hand
  }

  get actionCompleted(): boolean {
    return this._actionCompleted
  }
}
