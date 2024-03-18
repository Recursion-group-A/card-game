import * as Phaser from 'phaser'
import PokerPreloadScene from '@/phaser/poker/PokerPreloadScene'
import PokerScene from '@/phaser/poker/PokerScene'

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-poker-game',
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-poker-game',
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
  scene: [PokerPreloadScene, PokerScene]
}

export default gameConfig
