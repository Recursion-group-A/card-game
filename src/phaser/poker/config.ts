import Phaser from 'phaser'
import PokerScene from '@/phaser/poker/PokerScene'
import PreloadScene from '@/phaser/common/PreloadScene'

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-poker-game',
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-poker-game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 720,
      height: 345
    },
    max: {
      width: 1920,
      height: 920
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: [PreloadScene, PokerScene]
}

export default gameConfig
