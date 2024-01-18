import * as Phaser from 'phaser'
import { SUITS_FOR_IMAGE } from '@/constants/cards/suits.constants'
import { RANKS_FOR_IMAGE } from '@/constants/cards/ranks.constants'

export default class PreloadScene extends Phaser.Scene {
  private _nextScene: string | undefined

  constructor() {
    super('PreloadScene')
  }

  init(data: { nextScene: string }): void {
    this._nextScene = data.nextScene
  }

  preload(): void {
    const { width, height } = this.cameras.main

    this.load.setBaseURL('../../assets/')
    this.load.image('table', 'ui/table.jpeg')

    // 全種類のカードを読み込む
    SUITS_FOR_IMAGE.forEach((suit: string) => {
      RANKS_FOR_IMAGE.forEach((rank: string) => {
        const key: string = `card_${suit}_${rank}`
        this.load.image(key, `cards/${key}.png`)
      })
    })

    this.load.image('card-back', 'cards/card_back.png')
    this.load.image('joker-black', 'cards/card_joker_black.png')
    this.load.image('joker-red', 'cards/card_joker_red.png')
    this.load.image('chip', 'ui/coin.png')
    this.load.image('dealer-btn', 'ui/dealer_button.png')
    this.load.image('btn-dark', 'ui/button.png')
    this.load.image('home-button', 'ui/home_button.png')
    this.load.image('sound-on', 'ui/sound_on.png')
    this.load.image('sound-off', 'ui/sound_off.png')

    this.load.audio('click', 'sounds/click2.mp3')
    this.load.audio('click3', 'sounds/click3.wav')
    this.load.audio('card-sound', 'sounds/card-sound.mp3')
    this.load.audio('card-flip1', 'sounds/card-flip1.mp3')
    this.load.audio('card-flip2', 'sounds/card-flip2.mp3')
    this.load.audio('card-flip3', 'sounds/card-flip3.mp3')
    this.load.audio('bet', 'sounds/bet.mp3')
    this.load.audio('retro', 'sounds/retro-sound.wav')
    this.load.audio('hit', 'sounds/hit.wav')
    this.load.audio('fold', 'sounds/fold.wav')
    this.load.audio('negative', 'sounds/negative-sound.wav')
    this.load.audio('money', 'sounds/money.wav')

    const progressBar: Phaser.GameObjects.Graphics = this.add.graphics()
    const progressBox: Phaser.GameObjects.Graphics = this.add.graphics()
    const loadingText: Phaser.GameObjects.Text = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...'
    })
    const percentText: Phaser.GameObjects.Text = this.make.text({
      x: width / 2,
      y: height / 2 + 30,
      text: '0%'
    })

    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(width / 2 - 300, height / 2 - 120, 600, 200)
    loadingText.setOrigin(0.5)
    percentText.setOrigin(0.5)

    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(width / 2 - 150, height / 2 - 30, 300 * value, 30)
      percentText.setText(`${parseInt(String(value * 100), 10)}%`)
    })
  }

  create(): void {
    this.scene.start(this._nextScene)
  }
}
