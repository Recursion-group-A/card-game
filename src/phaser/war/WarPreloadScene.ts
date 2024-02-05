import PreloadScene from '@/phaser/common/PreloadScene'

export default class WarPreloadScene extends PreloadScene {
  constructor() {
    super('WarPreloadScene')
  }

  preload() {
    super.preload()
  }

  create() {
    super.create('WarScene')
  }
}
