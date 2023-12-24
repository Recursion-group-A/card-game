import Phaser from 'phaser'
import HomeScene from '@/phaser/common/HomeScene'
import PreloadScene from '@/phaser/common/PreloadScene'
import BlackjackScene from '@/phaser/blackjack/BlackjackScene'
import PokerScene from '@/phaser/poker/PokerScene'

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-game',
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-game',
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
  scene: [HomeScene, PreloadScene, BlackjackScene, PokerScene]
}

export default gameConfig
