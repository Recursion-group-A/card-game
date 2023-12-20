// commonからCardクラスを読み込み
import Card from '../common/Card'
import Hand from '../common/Hand'
import PLAYERTYPES from '@/types/playerTypes'

export default class SpeedPlayer {
  private readonly playerName: string

  private readonly playerType: PLAYERTYPES

  private  playerHand: Array<Card> = []

  constructor(playerName: string, playerType: PLAYERTYPES, chips = 1000) {
    this.playerName = playerName
    this.playerType = playerType

  }

  // プレイヤーの名前を確認
  get PlayerNAme(): string {
    return this.playerName
  }

  // プレイヤーのタイプを確認。スピードの場合「player」、「house」
  get PlayerType(): PLAYERTYPES{
    return this.playerType
  }

  // プレイヤーの手札を確認
  get Hand(): Array<Card>{
    return this.playerHand
  }

  set Hand(card:Card){
    this.playerHand.push(card)
  }

  // プレイヤーの手札の枚数を確認
  public getHandLength(): number {
    return this.playerHand.length
  }
}

// import Player from "../common/Player";

// export default class SpeedPlayer extends Player{
//     public getHandLength(): number { 
//         return this.getHand.length
//     }
// }