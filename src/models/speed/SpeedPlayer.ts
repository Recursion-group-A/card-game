// commonからCardクラスを読み込み
import Card from '../common/Card'

export default class SpeedPlayer {
  public playerName: string

  public playerType: string

  public playerHand: Array<Card> = []

  public chips: number

  public bet: number

  public winAmount: number

  public gameStatus: string

  constructor(playerName: string, playerType: string, chips = 1000) {
    this.playerName = playerName
    this.playerType = playerType
    this.chips = chips
    this.bet = 0
    this.winAmount = 0
    this.gameStatus = 'selectLevel'
  }

  // プレイヤーの名前を確認
  public getPlayerNAme(): string {
    return this.playerName
  }

  // プレイヤーのタイプを確認。スピードの場合「ユーザー」、「ＣＰ」
  public getPlayerTypr(): string {
    return this.playerType
  }

  // チップ額の確認
  public getChips(): number {
    return this.chips
  }

  // ベット額の確認
  public getBet(): number {
    return this.bet
  }

  public getGameStatus(): string {
    return this.gameStatus
  }

  // プレイヤーの手札を確認
  public getHand(): Array<Card> {
    return this.playerHand
  }

  // プレイヤーの手札の枚数を確認
  public getHandLength(): number {
    return this.playerHand.length
  }
}
