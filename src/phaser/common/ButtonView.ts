import Phaser from 'phaser'

type Props = {
  width: number
  height: number
  onClick: () => void
  fontSize: string
  color: string
}

export default class ButtonView extends Phaser.GameObjects.Container {
  private readonly container: Phaser.GameObjects.Graphics

  private readonly text: Phaser.GameObjects.Text

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    props: Props,
    background: number
  ) {
    super(scene, x, y)

    const {
      width = props.width,
      height = props.height,
      onClick,
      fontSize = props.fontSize,
      color = props.color
    } = props

    this.container = scene.add.graphics()
    this.container.fillStyle(background, 1)
    this.container.fillRoundedRect(0, 0, width, height, 20)
    this.container.setPosition(-width / 2, -height / 2)

    this.text = scene.add
      .text(0, 0, text, { fontSize, color })
      .setOrigin(0.5, 0.5)

    this.add([this.container, this.text])

    this.setSize(width, height)
    this.setInteractive({ useHandCursor: true })
    this.on('pointerdown', onClick)

    scene.add.existing(this)
  }
}
