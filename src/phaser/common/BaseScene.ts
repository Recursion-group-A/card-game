import * as Phaser from 'phaser'

export default abstract class BaseScene extends Phaser.Scene {
  protected static readonly DELAY_TIME: number = 1500

  protected sceneWidth: number | undefined

  protected sceneHeight: number | undefined

  protected background: Phaser.GameObjects.Image | undefined

  protected homeButton: Phaser.GameObjects.Image | undefined

  protected soundButton: Phaser.GameObjects.Image | undefined

  protected isGameActive: boolean

  protected isSoundOn: boolean

  protected constructor(key: string) {
    super(key)

    this.isGameActive = true
    this.isSoundOn = true
  }

  create(): void {
    this.sceneWidth = this.cameras.main.width
    this.sceneHeight = this.cameras.main.height

    this.createBackground()
    this.createHomeButton()
    this.createSoundButton()
  }

  public async waitForUserClick(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.input.once('pointerdown', () => {
        resolve()
      })
    })
  }

  public playSoundEffect(soundKey: string): void {
    if (this.isSoundOn) {
      this.sound.add(soundKey).setVolume(0.3).play()
    }
  }

  // eslint-disable-next-line
  public redirectToHomePage(): void {
    window.location.href = '/'
  }

  protected abstract startGame(): Promise<void>

  private createBackground(): void {
    this.background = this.add.image(
      this.sceneWidth! / 2,
      this.sceneHeight! / 2,
      'table'
    )
  }

  private createHomeButton(): void {
    this.homeButton = this.add.image(50, 40, 'home-button').setScale(0.75, 0.85)
    this.homeButton.setInteractive({ useHandCursor: true })
    this.homeButton.on('pointerover', () => {
      this.scaleButton(this.homeButton!, 0.8, 0.9)
    })
    this.homeButton.on('pointerout', () => {
      this.scaleButton(this.homeButton!, 0.75, 0.85)
    })
    this.homeButton.on('pointerdown', () => {
      window.location.href = '/'
    })
  }

  private createSoundButton() {
    this.soundButton = this.add
      .image(this.sceneWidth! - 50, 40, 'sound-on')
      .setScale(0.8, 0.9)
    this.soundButton.setInteractive({ useHandCursor: true })
    this.soundButton.on('pointerover', () =>
      this.scaleButton(this.soundButton!, 0.85, 0.95)
    )
    this.soundButton.on('pointerout', () =>
      this.scaleButton(this.soundButton!, 0.8, 0.9)
    )
    this.soundButton.on('pointerdown', () => this.toggleSound())
  }

  private toggleSound() {
    const texture: string = this.isSoundOn ? 'sound-off' : 'sound-on'
    this.soundButton?.setTexture(texture)
    this.isSoundOn = !this.isSoundOn
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
