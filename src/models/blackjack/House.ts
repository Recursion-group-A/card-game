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

  public prepareNextRound(): void {
    this._hand.resetHand()
    this._status = ParticipantStatuses.Wait
    this._actionCompleted = false
  }

  public getHandTotalScore(): number {
    return this._hand.calculateBlackjackTotal()
  }

  public isHandTotalScoreAbove17(): boolean {
    return this.getHandTotalScore() >= 17
  }

  private updateStatusAndCompleteAction(status: ParticipantStatuses): void {
    this._status = status
    this._actionCompleted = true
  }

  public bust(): void {
    this.updateStatusAndCompleteAction(ParticipantStatuses.Bust)
  }

  public stand(): void {
    this.updateStatusAndCompleteAction(ParticipantStatuses.Stand)
  }

  public blackjack(): void {
    this.updateStatusAndCompleteAction(ParticipantStatuses.Blackjack)
  }

  public isBlackjack(): boolean {
    return this._hand.isBlackjack()
  }

  public addHand(card: Card): void {
    this._hand.addOne(card)
  }

  public static generateHand(): BlackjackHand {
    return new BlackjackHand()
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
