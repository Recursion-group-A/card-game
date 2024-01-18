import Player from '@/models/common/Player'
import BlackjackHand from '@/models/blackjack/BlackjackHand'
import PlayerTypes from '@/types/common/player-types'
import { PlayerStatus } from '@/types/blackjack/player-status-types'
import GameResult from '@/types/blackjack/game-result-types'
import HouseStatus from '@/types/blackjack/house-status-types'

export default class BlackjackPlayer extends Player<BlackjackHand> {
  private _currentTurn: number

  private _status: PlayerStatus

  private _actionCompleted: boolean

  private _gameResult: GameResult

  constructor(playerType: PlayerTypes, playerName: string) {
    super(playerType, playerName)

    this._hand = this.generateHand()
    this._currentTurn = 1
    this._status = PlayerStatus.Wait
    this._actionCompleted = false
    this._gameResult = GameResult.Draw

    this.decideAiPlayerBetAmount()
  }

  public getHandTotalScore(): number {
    return this.hand.calculateBlackjackTotal()
  }

  public incrementCurrentTurn(): void {
    this.currentTurn += 1
  }

  public isFirstTurn(): boolean {
    return this.currentTurn === 1
  }

  public isBlackjack(): boolean {
    return this.hand.isBlackjack()
  }

  public isBust(): boolean {
    return this.hand.isBust()
  }

  public canBet(bet: number): boolean {
    return this.bet + bet <= this.chips
  }

  public canHit(): boolean {
    return this.hand.canHit()
  }

  public canDouble(): boolean {
    if (this.isBlackjack()) return false

    return this.isFirstTurn() && this.chips - this._bet >= 0
  }

  public canSurrender(): boolean {
    if (this.isBlackjack()) return false

    const halfBet: number = Math.floor(this.bet / 2)

    return this.isFirstTurn() && halfBet > 0
  }

  public bust(): void {
    this._status = PlayerStatus.Bust
    this._actionCompleted = true
  }

  public stand(): void {
    this._status = PlayerStatus.Stand
    this._actionCompleted = true
  }

  public double(): void {
    this.placeBet(this.bet)
    this._status = PlayerStatus.DoubleDown
    this._actionCompleted = true
  }

  public surrender(): void {
    const currentBet: number = this.bet

    this.subtractBet(Math.floor(currentBet / 2))
    this.addChips(Math.floor(currentBet / 2))
    this._status = PlayerStatus.Surrender
    this._actionCompleted = true
  }

  public blackjack(): void {
    this._status = PlayerStatus.Blackjack
    this.actionCompleted = true
  }

  public evaluating(houseScore: number, houseStatus: HouseStatus) {
    if (
      this._status === PlayerStatus.Bust ||
      (houseStatus !== HouseStatus.Bust &&
        this.getHandTotalScore() < houseScore)
    ) {
      this._gameResult = GameResult.Lose
    } else if (this.getHandTotalScore() !== houseScore) {
      this._gameResult = GameResult.Win
    }
  }

  public decideAiPlayerBetAmount(): void {
    if (this.playerType === PlayerTypes.Ai) {
      const max: number = Math.floor(this.chips * 0.2)
      const min: number = Math.floor(this.chips * 0.1)
      this.bet = Math.floor(Math.random() * (max - min) + min)

      this.subtractChips(this.bet)
    }
  }

  // eslint-disable-next-line
  protected generateHand(): BlackjackHand {
    return new BlackjackHand()
  }

  get currentTurn(): number {
    return this._currentTurn
  }

  set currentTurn(numOfTurns: number) {
    this._currentTurn = numOfTurns
  }

  get status(): PlayerStatus {
    return this._status
  }

  set status(playerStatus: PlayerStatus) {
    this._status = playerStatus
  }

  get actionCompleted(): boolean {
    return this._actionCompleted
  }

  set actionCompleted(bool: boolean) {
    this._actionCompleted = bool
  }

  get gameResult(): GameResult {
    return this._gameResult
  }
}
