import Phaser from 'phaser'
// PreloadSceneのコードを書き換えることでブラックジャックにできる
import PokerScene from '@/phaser/blackjack/BlackjackScene'
import PreloadScene from '@/phaser/common/PreloadScene'

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-blackjack-game',
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-blackjack-game',
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
