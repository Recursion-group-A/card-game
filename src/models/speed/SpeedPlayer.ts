import Player from '../common/Player'

export default class SpeedPlayer extends Player {
  // 手札の枚数を確認する
  private getHandLength(): number {
    return this.getHand.length
  }
}
