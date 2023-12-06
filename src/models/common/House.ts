import Card from '@/models/common/Card'
import Hand from '@/models/common/Hand'
import Deck from '@/models/common/Deck'
import { HOUSE_STATES } from '@/constants/houseStates'

export default class House {
  private hand: Hand

  private states: string

  constructor() {
    this.hand = new Hand()
    this.states = HOUSE_STATES.WAIT
  }

  public initializeHand(): void {
    this.hand.cleanHand()
  }

  public initializeStates(): void {
    this.states = HOUSE_STATES.WAIT
  }

  public prepareForNextRound(): void {
    this.initializeHand()
    this.initializeStates()
  }

  public getHandTotalScore(): number {
    return this.hand.getHandTotalScore()
  }

  // TODO: START Playerクラスと共通する処理 → 後で抽象クラス Participant クラスを作る
  public addCard(card: Card): void {
    this.hand.addOne(card)
  }

  public changeStates(states: string): void {
    this.states = states
  }
  // TODO: END Playerクラスと共通する処理

  // House 特有のアクション
  // public revealHand(): void {
  //     TODO: 伏せたカードを表向きにするアクション
  // }

  public setToStand(): void {
    this.changeStates(HOUSE_STATES.STAND)
  }

  public setToBust(): void {
    this.changeStates(HOUSE_STATES.BUST)
  }

  public setToBlackjack(): void {
    this.changeStates(HOUSE_STATES.BLACKJACK)
  }

  public isBlackjack(): boolean {
    return this.hand.isBlackjack()
  }

  public drawUntilSeventeen(deck: Deck): void {
    if (this.getHandTotalScore() === 21) this.setToBlackjack()

    while (this.getHandTotalScore() < 17) {
      const card: Card | undefined = deck.drawOne()

      if (!card) {
        throw new Error('Deck is empty.')
      }

      this.addCard(card)

      if (this.getHandTotalScore() > 21) {
        this.setToBust()
        break
      } else if (this.getHandTotalScore() >= 17) {
        this.setToStand()
        break
      }
    }
  }
}
