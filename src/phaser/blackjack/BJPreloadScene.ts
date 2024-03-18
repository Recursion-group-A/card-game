import PreloadScene from '@/phaser/common/PreloadScene'

export default class PokerPreloadScene extends PreloadScene {
  constructor() {
    super('BJPreloadScene')
  }

  preload() {
    super.preload()
  }

  create() {
    // TODO：BetScene に変更する
    super.create('BlackjackScene')
  }
}
