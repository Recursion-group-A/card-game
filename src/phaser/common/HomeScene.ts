import Phaser from 'phaser'

export default class HomeScene extends Phaser.Scene {
  constructor() {
    super('HomeScene')
  }

  preload(): void {
    this.load.setBaseURL('../../assets/')
    this.load.image('home-table', 'home.png')
    this.load.image('button', 'Rect-Dark-Default.png')
  }

  create(): void {
    const { width, height } = this.cameras.main
    this.add.image(width / 2, height / 2, 'home-table')
    this.add
      .text(width / 2, height / 4, 'CARD GAME', { font: '75px' })
      .setOrigin(0.5)

    this.createButton(width / 2 - 100, height / 2 + 100, 'Blackjack')
    this.createButton(width / 2 + 100, height / 2 + 100, 'Poker')
  }

  private createButton(x: number, y: number, game: string): void {
    const container: Phaser.GameObjects.Container = this.add.container()
    const button: Phaser.GameObjects.Image = this.add
      .image(x, y, 'button')
      .setScale(1.4, 1.1)
      .setInteractive({ useHandCursor: true })
    button.on('pointerover', () => button.setScale(1.5, 1.2))
    button.on('pointerout', () => button.setScale(1.4, 1.1))
    button.on('pointerdown', () => this.startPreload(`${game}Scene`))

    const text: Phaser.GameObjects.Text = this.add
      .text(x, y, game.toUpperCase())
      .setOrigin(0.5, 0.5)
    container.add([button, text])
  }

  private startPreload(nextScene: string): void {
    this.scene.start('PreloadScene', { nextScene })
  }
}
