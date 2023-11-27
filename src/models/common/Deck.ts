import Card from '@/models/common/Card'
import { SUITS, RANKS } from '@/constants/cards'
import { GAMETYPE, GAMESWITHJOKER } from '@/types/gameTypes'
import { RankStrategy } from '@/models/common/RankStrategy'

export default class Deck {
  private readonly gameType: GAMETYPE

  private readonly rankStrategy: RankStrategy

  private deck: Card[]

  constructor(gameType: GAMETYPE, rankStrategy: RankStrategy) {
    this.gameType = gameType
    this.rankStrategy = rankStrategy
    this.deck = this.generateDeck(GAMESWITHJOKER.includes(this.gameType))
  }

  public getGameType(): GAMETYPE {
    return this.gameType
  }

  public getRankStrategy(): RankStrategy {
    return this.rankStrategy
  }

  public getDeckSize(): number {
    return this.deck.length
  }

  public getCardAt(index: number): Card {
    return this.deck[index]
  }

  // デッキ作成 ジョーカー追加
  public generateDeck(addJoker: boolean = false): Card[] {
    const newDeck: Card[] = []

    SUITS.forEach((suit) => {
      RANKS.forEach((rank) => {
        newDeck.push(new Card(suit, rank, this.rankStrategy))
      })
    })

    if (addJoker) {
      newDeck.push(Card.createJoker(this.rankStrategy))
      newDeck.push(Card.createJoker(this.rankStrategy))
    }
    return newDeck
  }

  // 呼び出しに使われるメソッド 公開
  public shuffle(): void {
    this.performShuffle()
  }

  // // 実際にシャッフルを行うメソッド 非公開
  private performShuffle(): void {
    for (let i = this.deck.length - 1; i >= 0; i -= 1) {
      const j: number = Math.floor(Math.random() * (i + 1))
      ;[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
    }
  }

  public resetDeck(): void {
    this.deck = this.generateDeck(GAMESWITHJOKER.includes(this.gameType))
    this.shuffle()
  }

  // スピードでは undefinedが必要になるかも
  public drawOne(): Card | undefined {
    return this.deck.shift()
  }
}
