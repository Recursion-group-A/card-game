import Card from '@/models/common/Card'
import BlackjackHand from '@/models/blackjack/BlackjackHand'
import { ParticipantStatuses } from '@/types/blackjack/participant-status-types'

export default class House {
  private readonly _name: string = 'HOUSE'

  private _hand: BlackjackHand

  private _status: ParticipantStatuses

  private _actionCompleted: boolean

  constructor() {
    this._hand = House.generateHand()
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

  public prepareNextRound(): void {
    this._hand = House.generateHand()
    this._status = ParticipantStatuses.Wait
    this._actionCompleted = false
  }

  public getHandTotalScore(): number {
    return this._hand.calculateBlackjackTotal()
  }

  // TODO: START Playerクラスと共通する処理 → 後で抽象クラス Participant クラスを作る
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

  set status(status: ParticipantStatuses) {
    this.status = status
  }

  get hand(): BlackjackHand {
    return this._hand
  }

  get actionCompleted(): boolean {
    return this._actionCompleted
  }
}
