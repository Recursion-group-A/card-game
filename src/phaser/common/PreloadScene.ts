import Phaser from 'phaser'
import { SUITSFORIMAGE, RANKSFORIMAGE } from '@/constants/cards'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  public preload(): void {
    const { width, height } = this.cameras.main

    this.load.setBaseURL('../../assets/')
    this.load.image('table', 'table.jpeg')

    // 全種類のカードを読み込む
    SUITSFORIMAGE.forEach((suit: string) => {
      RANKSFORIMAGE.forEach((rank: string) => {
        const key: string = `card_${suit}_${rank}`
        this.load.image(key, `cards/${key}.png`)
      })
    })

    this.load.image('card-back', 'cards/card_back.png')
    this.load.image('joker-black', 'cards/card_joker_black.png')
    this.load.image('joker-red', 'cards/card_joker_red.png')
    this.load.image('dealer-btn', 'dealerBtn.png')

    this.load.image('button', 'Default.png')

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

    this.load.on('complete', () => {
      this.scene.start('PokerScene')
    })
  }
}
