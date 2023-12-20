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

  private readonly _chipsText: Phaser.GameObjects.Text

  private readonly _dealerBtn: Phaser.GameObjects.Image

  private readonly _handCardViews: Phaser.GameObjects.Container

  private readonly _resultTextsContainer: Phaser.GameObjects.Container

  private _actionText: Phaser.GameObjects.Text | null = null

  constructor(
    scene: Phaser.Scene,
    player: Player,
    playerPosition: { x: number; y: number }
  ) {
    super(scene, playerPosition.x, playerPosition.y)
    this._playerModel = player
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
    this._dealerBtn = this.scene.add
      .image(
        this._playerNameText.x + 60,
        this._playerNameText.y + 7,
        'dealer-btn'
      )
      .setScale(0.08)
      .setVisible(false)
    this._handCardViews = this.scene.add.container()
    this._resultTextsContainer = this.scene.add.container()

    this.add([
      this._playerNameText,
      this._chipsText,
      this._dealerBtn,
      this._handCardViews,
      this._resultTextsContainer
    ])

    scene.add.existing(this)
  }

  get playerModel(): Player {
    return this._playerModel
  }

  update(): void {
    this._chipsText.setText(`CHIPS: ${this._playerModel.chips}`)
  }

  public removeDealerBtn(): void {
    this._dealerBtn.setVisible(false)
  }

  public addDealerBtn(): void {
    this._dealerBtn.setVisible(true)
    this.dealerBtnRotateAnimation()
  }

  private dealerBtnRotateAnimation(): void {
    this.scene.tweens.add({
      targets: this._dealerBtn,
      scaleX: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: (): void => {
        this._dealerBtn.setTexture('dealer-btn')
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
    this.update()
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
      y: 380,
      duration: 400,
      ease: 'Power2',
      onComplete: (): void => {
        chip.destroy(true)
      }
    })
  }

  public animateAddHand(x: number, y: number, card: Card, i: number): void {
    const cardView: CardView = new CardView(this.scene, x, y, card)

    cardView.animateCardMove(this.x + (i + 1) * 25 + 20, this.y + 60)
    this._handCardViews.add(cardView)
    this.scene.add.existing(this._handCardViews)
  }

  public revealHand(): void {
    this._handCardViews.each((child: CardView) => {
      child.open()
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

  private destroyActionText(): void {
    if (this._actionText) {
      this._actionText.destroy()
      this._actionText = null
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
      [PokerAction.CHECK]: '#aaf0d1',
      [PokerAction.NO_ACTION]: '#ffffff'
    }
    this._actionText?.setColor(colorMap[action])
  }

  public removeAllHand(): void {
    this._handCardViews.removeAll(true)
  }

  public displayResultTexts(winAmount: number): void {
    const winAmountText: Phaser.GameObjects.Text = this.scene.add.text(
      25,
      130,
      `Win: $${winAmount}`,
      {
        color: '#00ffff'
      }
    )
    const bestHandText: Phaser.GameObjects.Text = this.scene.add.text(
      winAmountText.x,
      winAmountText.y + 25,
      `${PokerHand[this._playerModel.bestHand!]}`,
      { color: '#00ff00' }
    )
    this._resultTextsContainer.add([winAmountText, bestHandText])
    this.add(this._resultTextsContainer)
  }

  public animateRefundToWinner(): void {
    this.update()
    for (let i: number = 0; i < 4; i += 1) {
      this.scene.time.delayedCall(i * 100, () => {
        this.animateChipMoveToPlayer(i)
      })
    }
  }

  private animateChipMoveToPlayer(offset: number): void {
    const chip: Phaser.GameObjects.Image = this.scene.add.image(
      510 + offset * 10,
      325,
      'chip'
    )
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

  public prepareForNextGame(): void {
    this.removeAllHand()
    this.removeDealerBtn()
    this._actionText?.destroy()
    this._resultTextsContainer.removeAll(true)
  }
}
