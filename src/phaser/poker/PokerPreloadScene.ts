import PreloadScene from '@/phaser/common/PreloadScene'

export default class PokerPreloadScene extends PreloadScene {
  constructor() {
    super('PokerPreloadScene')
  }

  preload() {
    super.preload()
  }

  create() {
    super.create('PokerScene')
  }
}
