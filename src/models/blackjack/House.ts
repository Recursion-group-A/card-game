import Card from '@/models/common/Card'
import Deck from '@/models/common/Deck'
import Hand from '@/models/blackjack/BlackjackHand'
import HOUSE_STATUS from '@/types/blackjack/house-status-types'

export default class House {
  private _hand: Hand

  private _status: string

  constructor() {
    this._hand = new Hand()
    this._status = HOUSE_STATUS.Wait
  }

  public prepareForNextRound(): void {
    this.initializeHand()
    this.initializeStates()
  }

  private initializeHand(): void {
    this._hand.resetHand()
  }

  private initializeStates(): void {
    this._status = HOUSE_STATUS.Wait
  }

  public getHandTotalScore(): number {
    return this._hand.calculateBlackjackTotal()
  }

  // TODO: START Playerクラスと共通する処理 → 後で抽象クラス Participant クラスを作る
  public addCard(card: Card): void {
    this._hand.addOne(card)
  }

  public drawUntilSeventeen(deck: Deck): void {
    if (this.getHandTotalScore() === 21) {
      this._status = HOUSE_STATUS.Blackjack
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
        this._status = HOUSE_STATUS.Bust
        break
      } else if (totalScore >= 17) {
        this._status = HOUSE_STATUS.Stand
        break
      }
    }
  }
}
