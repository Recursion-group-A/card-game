import Phaser from 'phaser'
import Card from '@/models/common/Card'
import Player from '@/models/poker/Player'
import CardView from '@/phaser/common/CardView'
import PLAYERTYPES from '@/types/playerTypes'

export default class PlayerView extends Phaser.GameObjects.Container {
  private readonly _playerModel: Player

  private readonly _handCardViews: CardView[] = []

  private readonly _playerNameText: Phaser.GameObjects.Text

  private readonly _chipsText: Phaser.GameObjects.Text

  private _actionText: Phaser.GameObjects.Text | undefined

  private _dealerBtn: Phaser.GameObjects.Image | undefined | null

  constructor(
    scene: Phaser.Scene,
    playerModel: Player,
    playerPos: { x: number; y: number }
  ) {
    super(scene, playerPos.x, playerPos.y)
    this._playerModel = playerModel
    this._playerNameText = this.scene.add.text(
      this._playerModel.playerType === PLAYERTYPES.PLAYER ? 44 : 40,
      0,
      `${this._playerModel.playerName.toUpperCase()}`
    )
    this._chipsText = this.scene.add.text(
      10,
      64 + 40, // カードの高さ → 64
      `CHIPS: ${this._playerModel.chips}`
    )

    this.add([this._playerNameText, this._chipsText])
    this.updateHand()

    scene.add.existing(this)
  }

  get playerModel(): Player {
    return this._playerModel
  }

  public update(): void {
    this._chipsText.setText(`CHIPS: ${this._playerModel.chips}`)
    this.updateHand()
  }

  private updateHand(): void {
    this.removeAllCards()

    const { hand } = this._playerModel
    hand.forEach((card: Card, index: number) => {
      const cardView: CardView = new CardView(this.scene, 0, 0, card)
      cardView.x = index * 25 + 45
      cardView.y = this._playerNameText.y + 64
      this.add(cardView)
      this._handCardViews.push(cardView)
    })
  }

  public removeAllCards(): void {
    this.remove(
      this.list.filter(
        (child: Phaser.GameObjects.GameObject) => child instanceof CardView
      ),
      true
    )
  }

  public addCardToHand(x: number, y: number, card: Card, i: number): void {
    const cardView: CardView = new CardView(this.scene, x, y, card)
    this.scene.add.existing(cardView)
    this._handCardViews.push(cardView)

    cardView.animateCardMove(this.x + (i + 1) * 25 + 20, this.y + 60)
  }

  public revealHand(): void {
    this._handCardViews.forEach((cardView: CardView) => {
      cardView.open()
    })
  }

  public addDealerBtn(): void {
    this._dealerBtn = this.scene.add
      .image(
        this._playerNameText.x + 60,
        this._playerNameText.y + 7,
        'dealer-btn'
      )
      .setScale(0.08)
    this.add(this._dealerBtn)
    this.dealerBtnRotateAnimation()
  }

  public removeDealerBtn(): void {
    if (this._dealerBtn) {
      this._dealerBtn.destroy()
      this._dealerBtn = null
    }
  }

  private dealerBtnRotateAnimation(): void {
    this.scene.tweens.add({
      targets: this._dealerBtn,
      scaleX: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: (): void => {
        this._dealerBtn?.setTexture('dealer-btn')
        this.scene.tweens.add({
          targets: this._dealerBtn,
          scaleX: 0.08,
          duration: 300,
          ease: 'Power2'
        })
      }
    })
  }

  public animatePlaceBet(): void {
    this._chipsText.setText(`CHIPS: ${this._playerModel.chips}`)
    const chip = this.scene.add.image(this.x + 60, this.y + 60, 'chip')
    this.animateChipMove(chip)
  }

  private animateChipMove(chip: Phaser.GameObjects.Image): void {
    this.scene.tweens.add({
      targets: chip,
      x: 510,
      y: 370,
      duration: 400,
      ease: 'Power2',
      onComplete: (): void => {
        chip.destroy()
      }
    })
  }

  public setInVisibleHandCards(): void {
    this._handCardViews.forEach((card: CardView) => {
      card.setVisible(false)
    })
  }

  public showActionText(action: string): void {
    const isFold: boolean = action === 'fold'
    const isRaise: boolean = action === 'raise'

    this.destroyActionText()

    this._actionText = this.scene.add.text(
      isRaise ? 27 : 36,
      isFold ? 45 : -35,
      action.toUpperCase(),
      { font: '20px' }
    )

    if (isFold) {
      this._actionText.setColor('#ff8c00')
    } else if (isRaise) {
      this._actionText.setColor('#ee82ee')
    } else {
      this._actionText.setColor('#ffd700')
    }

    this.add(this._actionText)

    setTimeout(() => {
      if (!isFold) this.destroyActionText()
    }, 1500)
  }

  private destroyActionText(): void {
    if (this._actionText) {
      this._actionText.destroy()
    }
  }
}
