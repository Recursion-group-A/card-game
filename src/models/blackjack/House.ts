import Card from '@/models/common/Card'
import Deck from '@/models/common/Deck'
import BlackjackHand from '@/models/blackjack/BlackjackHand'
import { ParticipantStatuses } from '@/types/blackjack/participant-status-types'
import { PlayerStatus } from '@/types/blackjack/player-status-types'
import HouseStatus from '@/types/blackjack/house-status-types'

export default class House {
  private readonly _name: string = 'HOUSE'

  private _hand: Hand

  private _status: HouseStatus

  private _actionCompleted: boolean

  constructor() {
    this._hand = new Hand()
    this._status = HouseStatus.Wait
    this._actionCompleted = false
  }

  public bust(): void {
    this._status = HouseStatus.Bust
    this._actionCompleted = true
  }

  public stand(): void {
    this._status = HouseStatus.Stand
    this._actionCompleted = true
  }

  public blackjack(): void {
    this._status = HouseStatus.Blackjack
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


  // TODO: START Playerクラスと共通する処理 → 後で抽象クラス Participant クラスを作る
  public addHand(card: Card): void {
    this._hand.addOne(card)
  }

  get name(): string {
    return this._name
  }

  get status(): HouseStatus {
    return this._status
  }

  set status(status: PlayerStatus) {
    this.status = status
  }

  get hand(): Hand {
    return this._hand
  }

  get actionCompleted(): boolean {
    return this._actionCompleted
  }
}
