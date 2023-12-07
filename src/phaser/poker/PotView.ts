import Phaser from 'phaser'

export default class PotView extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    const background = scene.add.graphics()
    background.fillStyle(0x000000, 0.5)
    background.fillRect(0, 0, 100, 50)

    this.add(background)
    scene.add.existing(this)
  }
}
