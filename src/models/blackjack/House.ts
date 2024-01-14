import Card from '@/models/common/Card'
import Deck from '@/models/common/Deck'
import BlackjackHand from '@/models/blackjack/BlackjackHand'
import { ParticipantStatuses } from '@/types/blackjack/participant-status-types'

export default class House {
  private _hand: BlackjackHand

  private _status: ParticipantStatuses

  constructor() {
    this._hand = new BlackjackHand()
    this._status = ParticipantStatuses.Wait
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

  public addCard(card: Card): void {
    this._hand.addOne(card)
  }

  public drawUntilSeventeen(deck: Deck): void {
    if (this.getHandTotalScore() === 21) {
      this._status = ParticipantStatuses.Blackjack
      return
    }

    while (this.getHandTotalScore() < 17) {
      const card: Card | undefined = deck.drawOne()

      if (!card) {
        throw new Error('Deck is empty.')
      }

      this.addCard(card)
      const totalScore: number = this.getHandTotalScore()

      if (totalScore > 21) {
        this._status = ParticipantStatuses.Bust
        break
      } else if (totalScore >= 17) {
        this._status = ParticipantStatuses.Stand
        break
      }
    }
  }
}
