import Phaser from 'phaser'
import Card from '@/models/blackjack/Card'
import Player from '@/models/blackjack/Player'
import CardView from '@/phaser/common/CardView'

export default class PlayerView extends Phaser.GameObjects.Container {
  private readonly _playerModel: Player

  private readonly _handCardViews: CardView[] = []

  private readonly _playerNameText: Phaser.GameObjects.Text

  private readonly _statesText: Phaser.GameObjects.Text

  private readonly _chipsText: Phaser.GameObjects.Text

  private readonly _betText: Phaser.GameObjects.Text

  private _dealerBtn: Phaser.GameObjects.Image | undefined | null

  constructor(
    scene: Phaser.Scene,
    playerModel: Player,
    playerPos: { x: number; y: number }
  ) {
    super(scene, playerPos.x, playerPos.y)
    this._playerModel = playerModel

    this._playerNameText = this.scene.add.text(
      40,
      0,
      `${this._playerModel.getPlayerName().toUpperCase()}`
    )
    this._statesText = this.scene.add.text(
      5,
      64 + 40,
      `STATES: ${this._playerModel.getStates()}`
    )
    this._chipsText = this.scene.add.text(
      5,
      64 + 60, // カードの高さ → 64
      `CHIPS: ${this._playerModel.getChips()}`
    )
    this._betText = this.scene.add.text(
      5,
      64 + 80,
      `BET: ${this._playerModel.getBet()}`
    )

    this.add([
      this._statesText,
      this._playerNameText,
      this._chipsText,
      this._betText
    ])
    this.updateHand()

    scene.add.existing(this)
  }

  get playerModel(): Player {
    return this._playerModel
  }

  get handCardViews(): CardView[] {
    return this._handCardViews
  }

  public update(): void {
    this._statesText.setText(`STATES: ${this._playerModel.getStates()}`)
    this._chipsText.setText(`CHIPS: ${this._playerModel.getChips()}`)
    this.updateHand()
  }

  private updateHand(): void {
    this.removeAllCards()

    const hand = this._playerModel.getHand()
    hand.forEach((card: Card, index: number) => {
      const cardView: CardView = new CardView(this.scene, 0, 0, card)
      cardView.x = index * 25 + 45
      cardView.y = this._playerNameText.y + 64
      this.add(cardView)
      this._handCardViews.push(cardView)
    })
  }

  private removeAllCards(): void {
    this.remove(
      this.list.filter(
        (child: Phaser.GameObjects.GameObject) => child instanceof CardView
      ),
      true
    )
  }

  public addCardToHand(
    deckPosition: { x: number; y: number },
    card: Card,
    i: number,
    delay: number
  ): void {
    const cardView: CardView = new CardView(
      this.scene,
      deckPosition.x,
      deckPosition.y,
      card
    )
    this.scene.add.existing(cardView)
    this._handCardViews.push(cardView)

    setTimeout(() => {
      cardView.animateCardMove(this.x + (i + 1) * 25 + 20, this.y + 60)
    }, delay)
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

  // public animatePlaceBet(amount: number): void {
  //   // this._playerModel.placeBet(amount)
  //   this._chipsText.setText(`CHIPS: ${this._playerModel.getChips()}`)
  // }
}
