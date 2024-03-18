import PreloadScene from '@/phaser/common/PreloadScene'

export default class WarPreloadScene extends PreloadScene {
  constructor() {
    super('WarPreloadScene')
  }

  preload() {
    super.preload()

    this.load.audio('gun', 'ui/gun.mp3')
    this.load.audio('sword', 'ui/sword-hit.mp3')
    this.load.audio('casino4', 'ui/casino4.wav')
  }

  create() {
    // TODO: BetScene が完成したら BetScene に変更する
    super.create('WarScene')
  }
}
