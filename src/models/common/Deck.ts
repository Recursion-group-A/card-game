import Card from '@/models/common/Card'
import { SUITS, RANKS } from '@/constants/cards'
import { GAMETYPE, GAMESWITHJOKER } from '@/types/gameTypes'
import { RankStrategy } from '@/models/common/RankStrategy'

export default class Deck {
  private gameType: GAMETYPE

  private rankStrategy: RankStrategy

  private deck: Card[]

  constructor(gameType: GAMETYPE, rankStrategy: RankStrategy) {
    this.gameType = gameType
    this.rankStrategy = rankStrategy
    this.deck = Deck.generateDeck(
      this.rankStrategy,
      GAMESWITHJOKER.includes(this.gameType)
    )
  }

  // デッキ作成 ジョーカー追加
  public static generateDeck(
    rankStrategy: RankStrategy,
    addJoker: boolean = false
  ): Card[] {
    const newDeck: Card[] = []

    SUITS.forEach((suit) => {
      RANKS.forEach((rank) => {
        newDeck.push(new Card(suit, rank, rankStrategy))
      })
    })

    if (addJoker) {
      newDeck.push(Card.createJoker(rankStrategy))
      newDeck.push(Card.createJoker(rankStrategy))
    }
    return newDeck
  }

  // 呼び出しに使われるメソッド 公開
  public shuffle(): void {
    Deck.performShuffle(this.deck)
  }

  // // 実際にシャッフルを行うメソッド 非公開・静的
  private static performShuffle(deck: Card[]): void {
    for (let i = deck.length - 1; i >= 0; i -= 1) {
      const j: number = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]] // eslint-disable-line
    }
  }

  public resetDeck(): void {
    this.deck = Deck.generateDeck(
      this.rankStrategy,
      GAMESWITHJOKER.includes(this.gameType)
    )
    this.shuffle()
  }

  // undefinedの場合は呼び出し元で管理する
  public drawOne(): Card | undefined {
    return this.deck.shift()
  }
}
