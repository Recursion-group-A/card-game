import Card from "@/components/Card"

export default class Hand {
  private hand: Card[]

  constructor() {
    this.hand = []
  }

  // 外部で変更されないようにコピーを返す
  public getHand(): Card[] {
    return [...this.hand]
  }

  public addOne(card: Card): void {
    this.hand.push(card)
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

  // TODO:ブラックジャックに特化　あとで変える
  public getHandTotalScore(): number {
    let total = 0
    let aceCount = 0

    this.hand.forEach((card: Card) => {
      if (card.getRank() === "A") {
        aceCount++
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
    return this.getHandTotalScore() === 21 && this.getCardCount() === 2
  }
}
