import * as Phaser from 'phaser'

export default class BaseScene extends Phaser.Scene {
  protected _sceneWidth: number | undefined

  protected _sceneHeight: number | undefined

  protected _background: Phaser.GameObjects.Image | undefined

  protected _homeButton: Phaser.GameObjects.Image | undefined

  protected _soundButton: Phaser.GameObjects.Image | undefined

  protected _isSoundOn: boolean

  constructor(key: string) {
    super(key)

    this._isSoundOn = true
  }

  create(): void {
    this._sceneWidth = this.cameras.main.width
    this._sceneHeight = this.cameras.main.height

    this.createBackground()
    this.createHomeButton()
    this.createSoundButton()
  }

  private createBackground(): void {
    this._background = this.add.image(
      this._sceneWidth! / 2,
      this._sceneHeight! / 2,
      'table'
    )
  }

  private createHomeButton(): void {
    this._homeButton = this.add
      .image(50, 40, 'home-button')
      .setScale(0.75, 0.85)
    this._homeButton.setInteractive({ useHandCursor: true })
    this._homeButton.on('pointerover', () => {
      this.scaleButton(this._homeButton!, 0.8, 0.9)
    })
    this._homeButton.on('pointerout', () => {
      this.scaleButton(this._homeButton!, 0.75, 0.85)
    })
    this._homeButton.on('pointerdown', () => {
      window.location.href = '/'
    })
  }

  private createSoundButton() {
    this._soundButton = this.add
      .image(this._sceneWidth! - 50, 40, 'sound-on')
      .setScale(0.8, 0.9)
    this._soundButton.setInteractive({ useHandCursor: true })
    this._soundButton.on('pointerover', () =>
      this.scaleButton(this._soundButton!, 0.85, 0.95)
    )
    this._soundButton.on('pointerout', () =>
      this.scaleButton(this._soundButton!, 0.8, 0.9)
    )
    this._soundButton.on('pointerdown', () => this.toggleSound())
  }

  private toggleSound() {
    const texture: string = this._isSoundOn ? 'sound-off' : 'sound-on'
    this._soundButton?.setTexture(texture)
    this._isSoundOn = !this._isSoundOn
  }

  // eslint-disable-next-line
  private scaleButton(
    button: Phaser.GameObjects.Image,
    scaleX: number,
    scaleY: number
  ) {
    button?.setScale(scaleX, scaleY)
  }
}
