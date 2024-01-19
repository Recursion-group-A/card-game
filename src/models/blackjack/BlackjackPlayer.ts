import Player from '@/models/common/Player'
import PlayerTypes from '@/types/common/player-types'
import BlackjackHand from '@/models/blackjack/BlackjackHand'
import GameResult from '@/types/blackjack/game-result-types'
import { ParticipantStatuses } from '@/types/blackjack/participant-status-types'

export default class BlackjackPlayer extends Player<BlackjackHand> {
  private _currentTurn: number

  private _status: ParticipantStatuses

  private _actionCompleted: boolean

  private _gameResult: GameResult

  constructor(playerType: PlayerTypes, playerName: string) {
    super(playerType, playerName)

    this._hand = this.generateHand()
    this._currentTurn = 1
    this._status = ParticipantStatuses.Wait
    this._actionCompleted = false
    this._gameResult = GameResult.Draw
  }

  public prepareNextRound(): void {
    this._hand = this.generateHand()
    if (this.isBroken()) {
      this._status = ParticipantStatuses.Broken
      this._actionCompleted = true
      this._gameResult = GameResult.No
    } else {
      this._currentTurn = 1
      this._status = ParticipantStatuses.Wait
      this._actionCompleted = false
      this._gameResult = GameResult.Draw
    }
  }

  public decideAiPlayerBetAmount(): void {
    if (!this.isBroken()) {
      if (this._chips < 100) {
        this.addBet(this._chips)
      } else {
        this.addBet(100)
      }

      this.subtractChips(this._bet)
    }
  }

  public getHandTotalScore(): number {
    return this._hand.calculateBlackjackTotal()
  }

  public incrementCurrentTurn(): void {
    this._currentTurn += 1
  }

  public isFirstTurn(): boolean {
    return this._currentTurn === 1
  }

  public isBroken(): boolean {
    return this._bet <= 0 && this._chips <= 0
  }

  public isBlackjack(): boolean {
    return this._hand.isBlackjack()
  }

  public isBust(): boolean {
    return this._hand.isBust()
  }

  private isWinner(): boolean {
    return this._gameResult === GameResult.Win
  }

  private isDrawer(): boolean {
    return this._gameResult === GameResult.Draw
  }

  public canBet(amount: number): boolean {
    return this._chips - amount >= 0
  }

  public canStandAi(): boolean {
    return (
      this._playerType === PlayerTypes.Ai &&
      this._hand.isHandTotalScoreAbove17()
    )
  }

  public canHit(): boolean {
    return this._hand.canHit()
  }

  public canDouble(): boolean {
    if (this.isBlackjack()) return false

    return this.isFirstTurn() && this._chips - this._bet >= 0
  }

  public canSurrender(): boolean {
    if (this.isBlackjack()) return false

    const halfBet: number = Math.floor(this._bet / 2)

    return this.isFirstTurn() && halfBet > 0
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

  public double(): void {
    this.placeBet(this._bet)
    this.updateStatusAndCompleteAction(ParticipantStatuses.DoubleDown)
  }

  public surrender(): void {
    const currentBet: number = this._bet

    this.subtractBet(Math.floor(currentBet / 2))
    this.addChips(Math.floor(currentBet / 2))
    this.updateStatusAndCompleteAction(ParticipantStatuses.Surrender)
  }

  public blackjack(): void {
    this.updateStatusAndCompleteAction(ParticipantStatuses.Blackjack)
  }

  private evaluateLoser(
    houseStatus: ParticipantStatuses,
    houseScore: number
  ): boolean {
    const isBust: boolean = this.isBust()
    const houseIsBust: boolean = houseStatus === ParticipantStatuses.Bust
    const isBelowHouseScore: boolean = this.getHandTotalScore() < houseScore

    return isBust || (!houseIsBust && isBelowHouseScore)
  }

  private evaluateWinner(
    houseStatus: ParticipantStatuses,
    houseScore: number
  ): boolean {
    const isBust: boolean = this.isBust()
    const houseIsBust: boolean = houseStatus === ParticipantStatuses.Bust
    const isAboveHouseScore: boolean = this.getHandTotalScore() > houseScore

    return isAboveHouseScore || (houseIsBust && !isBust)
  }

  public evaluating(houseStatus: ParticipantStatuses, houseScore: number) {
    if (this._status === ParticipantStatuses.Surrender || this.isBroken()) {
      this._gameResult = GameResult.No
    } else if (this.evaluateLoser(houseStatus, houseScore)) {
      this._gameResult = GameResult.Lose
    } else if (this.evaluateWinner(houseStatus, houseScore)) {
      this._gameResult = GameResult.Win
    }
  }

  public settlement(): void {
    if (this.isWinner()) {
      this.addChips(this._bet * 2)
    } else if (this.isDrawer()) {
      this.addChips(this._bet)
    }

    this.resetBet()
  }

  // eslint-disable-next-line
  protected generateHand(): BlackjackHand {
    return new BlackjackHand()
  }

  get status(): ParticipantStatuses {
    return this._status
  }

  get actionCompleted(): boolean {
    return this._actionCompleted
  }

  get gameResult(): GameResult {
    return this._gameResult
  }
}
