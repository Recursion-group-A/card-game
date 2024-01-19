import * as Phaser from 'phaser'
import Card from '@/models/common/Card'
import BlackjackPlayer from '@/models/blackjack/BlackjackPlayer'
import BlackjackTable from '@/models/blackjack/BlackjackTable'
import PlayerTypes from '@/types/common/player-types'
import DeckView from '@/phaser/common/DeckView'
import PlayerView from '@/phaser/blackjack/PlayerView'
import HouseView from '@/phaser/blackjack/HouseView'

export default class TableView extends Phaser.GameObjects.Container {
  private readonly _tableModel: BlackjackTable

  private readonly _playerViews: PlayerView[] = []

  private readonly _houseView: HouseView[] = []

  private readonly _deckView: DeckView

  private readonly _betButtons: Phaser.GameObjects.Container

  private readonly _actionButtons: Phaser.GameObjects.Container

  private _sceneWidth: number = this.scene.cameras.main.width

  private _sceneHeight: number = this.scene.cameras.main.height

  constructor(scene: Phaser.Scene, tableModel: BlackjackTable) {
    super(scene)

    this._tableModel = tableModel
    this._playerViews = []
    this._deckView = this.createDeckView()
    this._betButtons = this.scene.add.container()
    this._actionButtons = this.scene.add.container()
    this.createPlayerViews()
    this.createHouseView()

    this.add([this._deckView, this._betButtons, this._actionButtons])
    scene.add.existing(this)
  }

  private createDeckView(): DeckView {
    return new DeckView(this.scene, this._sceneWidth / 2, this._sceneHeight / 2)
  }

  private createPlayerViews(): void {
    const playersPos: { x: number; y: number }[] = [
      { x: 750, y: 100 },
      { x: 750, y: 350 },
      { x: 450, y: 550 },
      { x: 150, y: 350 },
      { x: 150, y: 100 }
    ]

    this._tableModel.players.forEach(
      (player: BlackjackPlayer, index: number) => {
        const playerView: PlayerView = new PlayerView(
          this.scene,
          player,
          playersPos[index]
        )
        this._playerViews.push(playerView)
        this.add(playerView)
      }
    )
  }

  private createHouseView(): void {
    const housePos: { x: number; y: number } = { x: 450, y: 100 }

    const houseView: HouseView = new HouseView(
      this.scene,
      this._tableModel.house,
      housePos
    )
    this._houseView.push(houseView)
    this.add(houseView)
  }

  public displayButtons(
    userView: PlayerView,
    content: string,
    n: number,
    type: string
  ) {
    const offset: number = 120
    const wspace: number = 120
    const hspace: number = 180

    this.createButton(
      userView.x + wspace * n - offset,
      userView.y + hspace,
      content,
      type
    )
  }

  private createButton(
    x: number,
    y: number,
    textContent: string,
    type: string
  ): void {
    const container: Phaser.GameObjects.Container = this.scene.add.container()
    const button: Phaser.GameObjects.Image = this.scene.add
      .image(x, y, 'btn-dark')
      .setScale(1.3, 0.8)
      .setInteractive({ useHandCursor: true })
    const text: Phaser.GameObjects.Text = this.scene.add.text(
      x,
      y,
      textContent.toUpperCase(),
      { font: '16px' }
    )
    text.setOrigin(0.5, 0.5)
    text.setName(textContent)

    container.add([button, text])

    if (type === 'bet') this._betButtons.add(container)
    else if (type === 'action') this._actionButtons.add(container)

    button.on('pointerover', () => {
      button.setScale(1.4, 0.9)
    })
    button.on('pointerout', () => {
      button.setScale(1.3, 0.8)
    })
  }

  public getUserBetInfo(): void {
    this._betButtons.each((child: Phaser.GameObjects.Container) => {
      child.list[0].on('pointerdown', () => {
        const betInfo: string = child.list[1].name

        if (betInfo === 'OK') {
          this.decideBetAmount()
        } else if (betInfo === 'RESET') {
          this.resetBetAmount()
        } else if (betInfo === 'ALL') {
          this.allIn()
        } else {
          this.addBet(Number(betInfo))
        }
      })
    })
  }

  public async getUserAction(): Promise<void> {
    this._actionButtons.each((child: Phaser.GameObjects.Container) => {
      child.list[0].on('pointerdown', () => {
        const action: string = child.list[1].name

        const userView: PlayerView = this.userView()
        const userModel: BlackjackPlayer = userView.playerModel

        if (action === 'STAND') {
          this.standProcess(userView, userModel)
        } else if (action === 'DOUBLE') {
          this.doubleProcess(userView, userModel)
        } else if (action === 'SURRENDER') {
          this.surrenderProcess(userView, userModel)
        } else {
          this.hitProcess(userView, userModel)
        }
      })
    })
  }

  public standProcess(userView: PlayerView, userModel: BlackjackPlayer): void {
    userModel.stand()
    userView.updateStatus()

    this.clearActionButtons()
  }

  public doubleProcess(userView: PlayerView, userModel: BlackjackPlayer): void {
    if (userModel.canDouble()) {
      userModel.double()

      const card: Card = this._tableModel.drawCard()
      userModel.addHand(card)
      userView.animateAddHand(
        this._deckView.x,
        this._deckView.y - 14,
        card,
        userModel.hand.cards.length - 1
      )
      userView.revealLastHand()

      if (userModel.isBust()) {
        userModel.bust()
      }
      userView.updateAll()

      this.clearActionButtons()
    }
  }

  public surrenderProcess(
    userView: PlayerView,
    userModel: BlackjackPlayer
  ): void {
    if (userModel.canSurrender()) {
      userModel.surrender()
      userView.updateStatus()
      userView.updateChips()
      userView.updateBet()

      this.clearActionButtons()
    }
  }

  public hitProcess(userView: PlayerView, userModel: BlackjackPlayer): void {
    if (userModel.canHit()) {
      const card: Card = this._tableModel.drawCard()
      userModel.addHand(card)
      userModel.incrementCurrentTurn()
      userView.animateAddHand(
        this._deckView.x,
        this._deckView.y - 14,
        card,
        userModel.hand.cards.length - 1
      )
      userView.revealLastHand()
      userView.updateScore()

      if (userModel.getHandTotalScore() === 21) {
        userModel.stand()
        userView.updateStatus()

        this.clearActionButtons()
      } else if (userModel.isBust()) {
        userModel.bust()
        userView.updateStatus()

        this.clearActionButtons()
      }
    }
  }

  public decideBetAmount(): void {
    const userModel: BlackjackPlayer = this.userModel()

    if (userModel.bet > 0) {
      this.clearBetButtons()
      this._tableModel.userBetCompleted = true
    }
  }

  public resetBetAmount(): void {
    const userView: PlayerView = this.userView()
    const userModel: BlackjackPlayer = userView.playerModel

    userModel.addChips(userModel.bet)
    userModel.resetBet()
    userView.updateBet()
    userView.updateChips()
  }

  public allIn(): void {
    const userView: PlayerView = this.userView()
    const userModel: BlackjackPlayer = userView.playerModel

    userModel.placeBet(userModel.chips)
    userView.updateBet()
    userView.updateChips()
  }

  public addBet(amount: number): void {
    const userView: PlayerView = this.userView()
    const userModel: BlackjackPlayer = userView.playerModel

    if (userModel.canBet(amount)) {
      userModel.placeBet(amount)
      userView.updateBet()
      userView.updateChips()
    }
  }

  public clearBetButtons(): void {
    this._betButtons.each((child: Phaser.GameObjects.Container) => {
      child.destroy()
    })

    this._betButtons.removeAll()
  }

  public clearActionButtons(): void {
    this._actionButtons.each((child: Phaser.GameObjects.Container) => {
      child.destroy()
    })

    this._actionButtons.removeAll()
  }

  public userModel(): BlackjackPlayer {
    const userModel: BlackjackPlayer | undefined =
      this._tableModel.players.find(
        (player) => player.playerType === PlayerTypes.Player
      )

    if (!userModel) {
      throw new Error('Unable to retrieve user model.')
    }

    return userModel
  }

  public userView(): PlayerView {
    const userView: PlayerView | undefined = this._playerViews.find(
      (playerView) => playerView.playerModel.playerType === PlayerTypes.Player
    )

    if (!userView) {
      throw new Error('Unable to retrieve user view.')
    }

    return userView
  }

  get playerViews(): PlayerView[] {
    return this._playerViews
  }

  get houseView(): HouseView[] {
    return this._houseView
  }

  get deckView(): DeckView {
    return this._deckView
  }
}
