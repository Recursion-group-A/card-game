import Phaser from 'phaser'

export default class ButtonView extends Phaser.GameObjects.Container {
  private readonly container: Phaser.GameObjects.Graphics

  private readonly text: Phaser.GameObjects.Text

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    onClick: () => void
  ) {
    super(scene, x, y)

    this.container = scene.add.graphics()
    this.container.fillStyle(0x0000ff, 1)
    this.container.fillRoundedRect(-75, -25, 150, 50, 20)

    this.text = scene.add
      .text(0, 0, text, {
        fontSize: '1rem',
        color: '#ffffff'
      })
      .setOrigin(0.5, 0.5)

    this.add([this.container, this.text])

    this.setSize(150, 50)
    this.setInteractive({ useHandCursor: true }).on('pointerdown', onClick)

    scene.add.existing(this)
  }
}
