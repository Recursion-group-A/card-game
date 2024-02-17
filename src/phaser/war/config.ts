import * as Phaser from 'phaser'
import WarPreloadScene from '@/phaser/war/WarPreloadScene'
import BetScene from '@/phaser/common/BetScene'
import WarScene from '@/phaser/war/WarScene'

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-war-game',
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-war-game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: window.innerWidth - window.innerWidth / 4,
      height: window.innerHeight - 50
    },
    max: {
      width: window.innerWidth - window.innerWidth / 4,
      height: window.innerHeight - 50
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: [WarPreloadScene, BetScene, WarScene]
}

export default gameConfig
