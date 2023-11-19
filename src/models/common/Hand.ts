import { Rank } from '@/types/ranks'
import Card from '@/models/common/Card'

export default class Hand {
  private hand: Card[]
  private score: number

  constructor() {
    this.hand = []
    this.score = 0
  }

  // 外部で変更されないようにコピーを返す
  public getHand(): Card[] {
    return [...this.hand]
  }

  public getScore(): number {
    return this.score
  }

  // 呼び出し元でハンドリングを行う
  public setToBlackjackScore(): void {
    if(this.isBlackjack()) {
      this.score = 21
    }
  }

  public addOne(card: Card): void {
    this.hand.push(card)
    this.addScore(card.getRankNumber())
  }

  public addScore(rankNumber: number): void {
    this.score += rankNumber
  }

  // 呼び出し元でハンドリングを行う
  public pickOne(): Card | undefined {
    return this.hand.shift()
  }

  public cleanHand(): void {
    this.hand = []
  }

  public getCardCount(): number {
    return this.hand.length
  }

  // TODO:ブラックジャックに特化
  public getHandTotalScore(): number {
    let total = 0
    let aceCount = 0

    this.hand.forEach((card: Card) => {
      if (card.getRank() === 'A') {
        aceCount += 1
      }
      total += card.getRankNumber()
    })

    while (aceCount > 0 && total <= 11) {
      total += 10
      aceCount -= 1
    }

    return total
  }

  public isBlackjack(): boolean {
    // 1ターン目でなければfalse
    if(this.getCardCount() !== 2) return false

    // Rankを配列に保存
    const rankArr: Rank[] = this.hand.map(card => card.getRank())

    // 1 includesでAが入っているか確認
    // 2 joinで配列を文字列にし、文字列に10、J、Q、Kのいずれかが含まれているか確認
    // 3 1,2がどちらもtrueならばblackjack
    return rankArr.includes("A") && /(10|J|Q|K)/.test(rankArr.join(" "))
  }

  public isBust(): boolean {
    return this.getHandTotalScore() > 21
  }

  public canHit(): boolean {
    return !this.isBlackjack() && !this.isBust()
  }
}
