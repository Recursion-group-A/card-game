import { Card } from "@/components/Card"
import { SUITS, RANKS, GAMESWITHJOKER } from "@/constants/constants"

export class Deck {
  private gameType: string
  private deck: Card[]

  constructor(gameType: string) {
    this.gameType = gameType.toLowerCase()
    this.deck = Deck.generateDeck(GAMESWITHJOKER.includes(this.gameType))
  }

  // デッキ作成 ジョーカー追加 シャッフル
  public static generateDeck(
    addJoker: boolean = false,
    shuffle: boolean = true
  ): Card[] {
    const newDeck: Card[] = []

    for (const suit of SUITS) {
      for (const rank of RANKS) {
        newDeck.push(new Card(suit, rank))
      }
    }

    if (addJoker) {
      newDeck.push(new Card(undefined, "Joker"))
    }
    if (shuffle) {
      Deck.shuffle(newDeck)
    }
    return newDeck
  }

  private static shuffle(deck: Card[]): void {
    for (let i = deck.length - 1; i >= 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
  }

  public resetDeck(): void {
    this.deck = Deck.generateDeck(GAMESWITHJOKER.includes(this.gameType))
  }

  // 先頭から一枚取り出す
  public drawOne(): Card | undefined {
    // TODO: ゲームごとに実装がことなってくるかも
    if (this.deck.length === 0) {
      throw new Error("Deck is empty")
    }
    return this.deck.shift()
  }
}
