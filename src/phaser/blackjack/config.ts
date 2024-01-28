import * as Phaser from 'phaser'
import BJPreloadScene from '@/phaser/blackjack/BJPreloadScene'
import BlackjackScene from '@/phaser/blackjack/BlackjackScene'

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-blackjack-game',
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-blackjack-game',
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
  scene: [BJPreloadScene, BlackjackScene]
}

export default gameConfig
