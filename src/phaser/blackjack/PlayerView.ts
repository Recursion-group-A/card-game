import * as Phaser from 'phaser'
import Card from '@/models/common/Card'
import CardView from '@/phaser/common/CardView'
import BlackjackPlayer from '@/models/blackjack/BlackjackPlayer'

export default class PlayerView extends Phaser.GameObjects.Container {
  private readonly _playerModel: BlackjackPlayer

  private readonly _handCardViews: Phaser.GameObjects.Container

  private readonly _playerNameText: Phaser.GameObjects.Text

  private readonly _betText: Phaser.GameObjects.Text

  private readonly _chipsText: Phaser.GameObjects.Text

  private readonly _resultText: Phaser.GameObjects.Text

  private readonly _statusText: Phaser.GameObjects.Text

  private readonly _scoreText: Phaser.GameObjects.Text

  private _dealerBtn: Phaser.GameObjects.Image | undefined | null

  constructor(
    scene: Phaser.Scene,
    playerModel: BlackjackPlayer,
    playerPos: { x: number; y: number }
  ) {
    super(scene, playerPos.x, playerPos.y)
    this._playerModel = playerModel

    this._resultText = this.scene.add.text(5, -60, `RESULT:`)
    this._playerNameText = this.scene.add.text(
      40,
      0,
      `${this._playerModel.playerName.toUpperCase()}`
    )
    this._betText = this.scene.add.text(
      -40,
      -32,
      `BET: ${this._playerModel.bet}`
    )
    this._chipsText = this.scene.add.text(
      70,
      -32, // カードの高さ → 64
      `CHIPS: ${this._playerModel.chips}`
    )
    this._statusText = this.scene.add.text(
      5,
      64 + 40,
      `STATES: ${this._playerModel.status}`
    )
    this._scoreText = this.scene.add.text(
      5,
      64 + 60,
      `SCORE: ${this._playerModel.getHandTotalScore()}`,
      {
        font: '24px',
        backgroundColor: 'blue'
      }
    )

    this._handCardViews = this.scene.add.container()

    this.add([
      this._resultText,
      this._playerNameText,
      this._betText,
      this._chipsText,
      this._statusText,
      this._scoreText,
      this._handCardViews
    ])
    // this.updateHand()

    scene.add.existing(this)
  }

  get playerModel(): BlackjackPlayer {
    return this._playerModel
  }

  public changeBlackjackColor(): void {
    this._playerNameText.setColor('#e6b422')
  }

  public updateGameResult(): void {
    this._resultText.setText(`RESULT: ${this._playerModel.gameResult}`)
  }

  public updateAll(): void {
    this.updateStatus()
    this.updateChips()
    this.updateBet()
    this.updateScore()
  }

  public updateStatus(): void {
    this._statusText.setText(`STATES: ${this._playerModel.status}`)
  }

  public updateChips(): void {
    this._chipsText.setText(`CHIPS: ${this._playerModel.chips}`)
  }

  public updateBet(): void {
    this._betText.setText(`BET: ${this._playerModel.bet}`)
  }

  public updateScore(): void {
    this._scoreText.setText(`SCORE: ${this._playerModel.getHandTotalScore()}`)
  }

  private removeAllCards(): void {
    this.remove(
      this.list.filter(
        (child: Phaser.GameObjects.GameObject) => child instanceof CardView
      ),
      true
    )
  }

  public revealHand(): void {
    this._handCardViews.each((child: CardView) => {
      child.open()
    })
  }

  public revealLastHand(): void {
    let i = 0
    this._handCardViews.each((child: CardView) => {
      i += 1
      if (i >= this._handCardViews.length) {
        child.open()
      }
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

  public animateAddHand(x: number, y: number, card: Card, i: number): void {
    const cardView: CardView = new CardView(this.scene, x, y, card)

    cardView.animateCardMove(this.x + (i + 1) * 25 + 20, this.y + 60)
    this._handCardViews.add(cardView)
    this.scene.add.existing(this._handCardViews)
  }
}
