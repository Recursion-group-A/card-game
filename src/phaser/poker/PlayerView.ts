import * as Phaser from 'phaser'
import Card from '@/models/common/Card'
import CardView from '@/phaser/common/CardView'
import PokerPlayer from '@/models/poker/PokerPlayer'
import PokerHand from '@/types/poker/hand-types'
import PokerActions from '@/types/poker/action-types'
import PlayerTypes from '@/types/common/player-types'

export default class PlayerView extends Phaser.GameObjects.Container {
  private readonly _playerModel: PokerPlayer

  private _playerNameText: Phaser.GameObjects.Text

  private _chipsText: Phaser.GameObjects.Text

  private _dealerBtn: Phaser.GameObjects.Image

  private readonly _handCardViews: Phaser.GameObjects.Container

  private readonly _resultTextsContainer: Phaser.GameObjects.Container

  private _actionText: Phaser.GameObjects.Text | null = null

  private _blindText: Phaser.GameObjects.Text | null = null

  constructor(
    scene: Phaser.Scene,
    player: PokerPlayer,
    playerPosition: { x: number; y: number }
  ) {
    super(scene, playerPosition.x, playerPosition.y)

    this._playerModel = player
    this._playerNameText = this.createPlayerNameText()
    this._chipsText = this.createChipsText()
    this._dealerBtn = this.createDealerButton()
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

  update(): void {
    this._chipsText.setText(`CHIPS: ${this._playerModel.chips}`)
  }

  public addDealerBtn(): void {
    this._dealerBtn.setVisible(true)
    this.dealerBtnRotateAnimation()
  }

  public setInvisibleDealerBtn(): void {
    this._dealerBtn.setVisible(false)
  }

  public animatePlaceBet(): void {
    this.animateChipMoveToPot()
    this.update()
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

  public removeAllHand(): void {
    this._handCardViews.removeAll(true)
  }

  public displayActionText(action: PokerActions): void {
    this.destroyActionText()

    const [x, y] = this.getActionTextPosition(action)
    this._actionText = this.scene.add.text(x, y, action.toUpperCase(), {
      font: '20px'
    })

    this.setActionTextColor(action)
    this.add(this._actionText)

    if (action !== PokerActions.Fold) {
      this.scene.time.delayedCall(1000, () => {
        this.destroyActionText()
      })
    }
  }

  public displayBlindText(amount: number): void {
    this._blindText?.destroy()

    const text: string =
      amount === 1 ? `SMALL BLIND：$${amount}` : ` BIG BLIND：$${amount}`

    this._blindText = this.scene.add.text(-10, 140, text)
    this._blindText.setColor('#00ff00')
    this.add(this._blindText)

    this.scene.time.delayedCall(1500, () => {
      this._blindText?.destroy()
    })
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
    const { bestHand } = this.playerModel
    const bestHandText: Phaser.GameObjects.Text = this.scene.add.text(
      bestHand ? winAmountText.x : winAmountText.x - 45,
      winAmountText.y + 30,
      `${bestHand ? PokerHand[bestHand] : 'Walk (No Contest)'}`,
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

  public prepareForNextGame(): void {
    this.removeAllHand()
    this.setInvisibleDealerBtn()
    this._actionText?.destroy()
    this._resultTextsContainer.removeAll(true)
  }

  private createPlayerNameText(): Phaser.GameObjects.Text {
    this._playerNameText = this.scene.add.text(
      this._playerModel.playerType === PlayerTypes.Player ? 44 : 40,
      0,
      `${this._playerModel.playerName.toUpperCase()}`
    )
    return this._playerNameText
  }

  private createChipsText(): Phaser.GameObjects.Text {
    this._chipsText = this.scene.add.text(
      10,
      64 + 40, // カードの高さ → 64
      `CHIPS: ${this._playerModel.chips}`
    )
    return this._chipsText
  }

  private createDealerButton(): Phaser.GameObjects.Image {
    this._dealerBtn = this.scene.add
      .image(
        this._playerNameText.x + 60,
        this._playerNameText.y + 7,
        'dealer-btn'
      )
      .setScale(0.08)
      .setVisible(false)
    return this._dealerBtn
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

  private destroyActionText(): void {
    this._actionText?.destroy()
    this._actionText = null
  }

  // eslint-disable-next-line
  private getActionTextPosition(action: PokerActions): [number, number] {
    const x: number =
      action === PokerActions.Check || action === PokerActions.Raise ? 28 : 35
    const y: number = action === PokerActions.Fold ? 45 : -35
    return [x, y]
  }

  private setActionTextColor(action: PokerActions): void {
    const colorMap = {
      [PokerActions.Fold]: '#ff8c00',
      [PokerActions.Call]: '#ffd700',
      [PokerActions.Raise]: '#ee82ee',
      [PokerActions.Check]: '#aaf0d1',
      [PokerActions.NoAction]: '#ffffff'
    }
    this._actionText?.setColor(colorMap[action])
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
        chip.destroy(true)
      }
    })
  }

  get playerModel(): PokerPlayer {
    return this._playerModel
  }
}
