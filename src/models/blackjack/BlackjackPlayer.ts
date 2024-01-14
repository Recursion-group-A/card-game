import Card from '@/models/common/Card'
import Deck from '@/models/common/Deck'
import Player from '@/models/common/Player'
import BlackjackHand from '@/models/blackjack/BlackjackHand'
import PlayerTypes from '@/types/common/player-types'
import { ParticipantStatuses } from '@/types/blackjack/participant-status-types'

export default class BlackjackPlayer extends Player<BlackjackHand> {
  private _currentTurn: number

  private _status: ParticipantStatuses

  constructor(playerType: PlayerTypes, playerName: string) {
    super(playerType, playerName)

    this._hand = this.generateHand()
    this._currentTurn = 1
    this._status = ParticipantStatuses.Wait
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

    const doubleBet: number = this.bet * 2
    const currentChips: number = this.chips

    return this.isFirstTurn() && doubleBet <= currentChips
  }

  public canSurrender(): boolean {
    if (this.isBlackjack()) return false

    const halfBet: number = Math.floor(this.bet / 2)

    return this.isFirstTurn() && halfBet > 0
  }

  public bust(): void {
    this._status = ParticipantStatuses.Bust
  }

  public stand(): void {
    this._status = ParticipantStatuses.Stand
  }

  public double(): void {
    this.placeBet(this.bet)
    this._status = ParticipantStatuses.DoubleDown
  }

  public surrender(): void {
    const currentBet: number = this.bet

    this.subtractBet(Math.floor(currentBet / 2))
    this.addChips(Math.floor(currentBet / 2))
    this._status = ParticipantStatuses.Surrender
  }

  public settlement(houseScore: number) {
    const playerScore: number = this.getHandTotalScore()

    if (houseScore === playerScore) {
      this.addChips(this.bet)
    } else if (houseScore > playerScore) {
      this.addChips(this.bet * 2)
    }
  }

  public decideAiPlayerBetAmount(): void {
    const max: number = Math.floor(this.chips * 0.2)
    const min: number = Math.floor(this.chips * 0.1)
    this.bet = Math.floor(Math.random() * (max - min) + min)

    this.subtractChips(this.bet)
  }

  public drawUntilSeventeen(deck: Deck): void {
    while (this.getHandTotalScore() < 17) {
      const card: Card | undefined = deck.drawOne()

      if (!card) {
        throw new Error('Deck is empty.')
      }

      this.addHand(card)
      this.incrementCurrentTurn()

      if (this.getHandTotalScore() > 21) {
        this._status = ParticipantStatuses.Bust
        break
      } else if (this.getHandTotalScore() >= 17) {
        this._status = ParticipantStatuses.Stand
        break
      }
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

  get status(): ParticipantStatuses {
    return this._status
  }

  set status(playerStatus: ParticipantStatuses) {
    this._status = playerStatus
  }
}
