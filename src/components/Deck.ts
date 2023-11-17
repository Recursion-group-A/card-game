  import { Card } from "@/components/Card"
  import { SUITS, RANKS, GAMESWITHJOKER, GAMETYPE } from "@/constants/constants"

  export class Deck {
    private gameType: GAMETYPE
    private deck: Card[]

    constructor(gameType: GAMETYPE) {
      this.gameType = gameType
      this.deck = Deck.generateDeck(GAMESWITHJOKER.includes(this.gameType))
    }

    // デッキ作成 ジョーカー追加
    public static generateDeck(addJoker: boolean = false): Card[] {
      const newDeck: Card[] = []

      for (const suit of SUITS) {
        for (const rank of RANKS) {
          newDeck.push(new Card(suit, rank))
        }
      }

      if (addJoker) {
        newDeck.push(Card.createJoker())
        newDeck.push(Card.createJoker())
      }
      return newDeck
    }

    // 呼び出しに使われるメソッド 公開
    public shuffle(): void {
      Deck.performShuffle(this.deck)
    }

    // 実際にシャッフルを行うメソッド 非公開・静的
    private static performShuffle(deck: Card[]): void {
      for (let i = deck.length - 1; i >= 0; i--) {
        const j: number = Math.floor(Math.random() * (i + 1))
        ;[deck[i], deck[j]] = [deck[j], deck[i]]
      }
    }

    public resetDeck(): void {
      this.deck = Deck.generateDeck(GAMESWITHJOKER.includes(this.gameType))
    }

    // undefinedの場合は呼び出し元で管理する
    public drawOne(): Card | undefined {
      return this.deck.shift()
    }
  }
