import Phaser from 'phaser'
import Card from '@/models/common/Card'
import Player from '@/models/poker/Player'
import CardView from '@/phaser/common/CardView'
import PLAYERTYPES from '@/types/playerTypes'
import PokerHand from '@/models/poker/PokerHand'
import PokerAction from '@/models/poker/PokerAction'

export default class PlayerView extends Phaser.GameObjects.Container {
  private readonly _playerModel: Player

  private readonly _playerNameText: Phaser.GameObjects.Text

  private readonly _handCardViews: Phaser.GameObjects.Container

  private readonly _chipsText: Phaser.GameObjects.Text

  private _actionText: Phaser.GameObjects.Text | null = null

  private _dealerBtn: Phaser.GameObjects.Image | null = null

  private readonly _resultTexts: Phaser.GameObjects.Container

  constructor(
    scene: Phaser.Scene,
    player: Player,
    pos: { x: number; y: number }
  ) {
    super(scene, pos.x, pos.y)
    this._playerModel = player
    this._playerNameText = this.scene.add.text(
      this._playerModel.playerType === PLAYERTYPES.PLAYER ? 44 : 40,
      0,
      `${this._playerModel.playerName.toUpperCase()}`
    )
    this._handCardViews = this.scene.add.container()
    this._chipsText = this.scene.add.text(
      10,
      64 + 40, // カードの高さ → 64
      `CHIPS: ${this._playerModel.chips}`
    )
    this._resultTexts = this.scene.add.container()

    this.add([
      this._playerNameText,
      this._handCardViews,
      this._chipsText,
      this._resultTexts
    ])
    this.updateHand()

    scene.add.existing(this)
  }

  get playerModel(): Player {
    return this._playerModel
  }

  update(): void {
    this._chipsText.setText(`CHIPS: ${this._playerModel.chips}`)
    this.updateHand()
  }

  private updateHand(): void {
    const { hand } = this._playerModel
    hand.forEach((card: Card, index: number) => {
      const cardView: CardView = new CardView(this.scene, 0, 0, card)
      cardView.x = index * 25 + 45
      cardView.y = this._playerNameText.y + 64
      this.add(cardView)
      this._handCardViews.add(cardView)
    })
  }

  public animateAddHand(x: number, y: number, card: Card, i: number): void {
    const cardView: CardView = new CardView(this.scene, x, y, card)
    this._handCardViews.add(cardView)
    this.scene.add.existing(this._handCardViews)

    cardView.animateCardMove(this.x + (i + 1) * 25 + 20, this.y + 60)
  }

  public revealHand(): void {
    this._handCardViews.each((child: CardView) => {
      child.open()
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

  public removeDealerBtn(): void {
    if (this._dealerBtn) {
      this._dealerBtn.destroy()
      this._dealerBtn = null
    }
  }

  public animatePlaceBet(): void {
    this._chipsText.setText(`CHIPS: ${this._playerModel.chips}`)
    this.animateChipMoveToPot()
  }

  private animateChipMoveToPot(): void {
    const chip: Phaser.GameObjects.Image = this.scene.add.image(
      this.x + 60,
      this.y + 60,
      'chip'
    )
    this.scene.tweens.add({
      targets: chip,
      x: 510,
      y: 340,
      duration: 400,
      ease: 'Power2',
      onComplete: (): void => {
        chip.destroy()
      }
    })
  }

  public animateRefundToWinner(): void {
    this._chipsText.setText(`CHIPS: ${this._playerModel.chips}`)
    for (let i: number = 0; i < 4; i += 1) {
      const chip: Phaser.GameObjects.Image = this.scene.add.image(
        510 + i * 5,
        325,
        'chip'
      )
      this.scene.time.delayedCall(i * 50, () => {
        this.animateChipMoveToPlayer(chip)
      })
    }
  }

  private animateChipMoveToPlayer(chip: Phaser.GameObjects.Image): void {
    this.scene.tweens.add({
      targets: chip,
      x: this.x + 60,
      y: this.y + 60,
      duration: 600,
      ease: 'Power2',
      onComplete: (): void => {
        chip.destroy()
      }
    })
  }

  public setInVisibleHandCards(): void {
    this._handCardViews.each((card: CardView) => {
      card.setVisible(false)
    })
  }

  public displayActionText(action: PokerAction): void {
    this.destroyActionText()

    const [x, y] = this.getActionTextPosition(action)
    this._actionText = this.scene.add.text(x, y, action.toUpperCase(), {
      font: '20px'
    })

    this.setActionTextColor(action)
    this.add(this._actionText)

    if (action !== PokerAction.FOLD) {
      this.scene.time.delayedCall(1000, () => {
        this.destroyActionText()
      })
    }
  }

  // eslint-disable-next-line
  private getActionTextPosition(action: PokerAction): [number, number] {
    const x: number =
      action === PokerAction.CHECK || action === PokerAction.RAISE ? 28 : 35
    const y: number = action === PokerAction.FOLD ? 45 : -35
    return [x, y]
  }

  private setActionTextColor(action: PokerAction): void {
    const colorMap = {
      [PokerAction.FOLD]: '#ff8c00',
      [PokerAction.CALL]: '#ffd700',
      [PokerAction.RAISE]: '#ee82ee',
      [PokerAction.CHECK]: '#aaf0d1'
    }
    this._actionText?.setColor(colorMap[action] || '#ffffff')
  }

  private destroyActionText(): void {
    if (this._actionText) {
      this._actionText.destroy()
      this._actionText = null
    }
  }

  public displayResultTexts(winAmount: number, bestHandRank: number): void {
    const winAmountText = this.scene.add.text(25, 130, `Win: $${winAmount}`, {
      color: '#00ffff'
    })
    const bestHandText = this.scene.add.text(
      25,
      155,
      `${PokerHand[bestHandRank]}`,
      { color: '#00ff00' }
    )
    this._resultTexts.add([winAmountText, bestHandText])

    this.add(this._resultTexts)
  }

  public prepareForNextGame(): void {
    this._handCardViews.removeAll(true)

    if (this._actionText) {
      this._actionText.destroy()
    }
    this._resultTexts.each((child: Phaser.GameObjects.GameObject) => {
      child.destroy()
    })
  }
}
