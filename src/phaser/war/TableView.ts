import * as Phaser from 'phaser'
import WarPlayer from '@/models/war/WarPlayer'
import WarTable from '@/models/war/WarTable'
import CardView from '@/phaser/common/CardView'
import PlayerView from '@/phaser/war/PlayerView'

export default class TableView extends Phaser.GameObjects.Container {
  private readonly _sceneWidth: number = this.scene.cameras.main.width

  private readonly _sceneHeight: number = this.scene.cameras.main.height

  private readonly _tableModel: WarTable

  private readonly _playerViews: PlayerView[] = []

  private _battleResultText: Phaser.GameObjects.Text | null = null

  private readonly _promptText: Phaser.GameObjects.Text

  private _roundResultText: Phaser.GameObjects.Container

  private _drawCards: Phaser.GameObjects.Container

  private _actionButtons: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene, tableModel: WarTable) {
    super(scene)

    this._tableModel = tableModel
    this.createPlayerViews()
    this._promptText = this.createPromptText()
    this._roundResultText = this.scene.add.container()
    this._drawCards = this.scene.add.container()
    this._actionButtons = this.scene.add.container()

    this.add([this._promptText])

    scene.add.existing(this)
  }

  update(): void {
    this._playerViews.forEach((player: PlayerView) => {
      player.update()
    })
  }

  public displayPromptText(): void {
    this.setVisiblePromptText(true)
    this.scene.tweens.add({
      targets: this._promptText,
      alpha: { start: 2, to: 0.5 },
      duration: 800,
      ease: 'Linear',
      repeat: -1,
      yoyo: true
    })
  }

  public setVisiblePromptText(bool: boolean): void {
    this._promptText.setVisible(bool)
  }

  public animateMoveToDeck(
    card1: CardView,
    card2: CardView,
    index: number
  ): void {
    const newXY: { x: number; y: number }[] = [
      { x: 835, y: 160 },
      { x: 200, y: 613 },
      { x: this._sceneWidth / 2 - 100, y: this._sceneHeight / 2 }
    ]

    const { x, y } = newXY[index]

    this.setDepth(this.depth + 1)

    switch (index) {
      case 2:
        card1.animateCardMove(x, y)
        card2.animateCardMove(x + 200, y)
        this._drawCards.add([card1, card2])
        break
      case 1:
        this.handleMoveToDeck(card2, card1, x, y, 1)
        break
      case 0:
        this.handleMoveToDeck(card1, card2, x, y, 0)
        break
      default:
    }
  }

  public displayBattleResultText(text: string): void {
    this._battleResultText?.destroy()
    const color: string = this.setColorBattleResult(text)

    this._battleResultText = this.scene.add
      .text(this._sceneWidth / 2 - 25, this._sceneHeight / 2 - 11, text, {
        font: '20px'
      })
      .setColor(color)

    this.add(this._battleResultText)
    this.scene.time.delayedCall(800, () => this._battleResultText?.destroy())
  }

  public displayRoundResult(): void {
    const numOfBotAcquired: number =
      this._playerViews[0].playerModel.acquiredCards
    const numOfPlayerAcquired: number =
      this._playerViews[1].playerModel.acquiredCards
    const result: string = this.judgeRoundResult(
      numOfBotAcquired,
      numOfPlayerAcquired
    )

    const scoreText: Phaser.GameObjects.Text = this.scene.add.text(
      this._sceneWidth / 2 - 28,
      this._sceneHeight / 2 - 25,
      `${numOfPlayerAcquired} vs ${numOfBotAcquired}`
    )
    const resultText: Phaser.GameObjects.Text = this.scene.add.text(
      this._sceneWidth / 2 - 30,
      this._sceneHeight / 2 + 5,
      `${result}`
    )

    this._roundResultText.add([scoreText, resultText])
  }

  public async promptUserDecision(): Promise<string> {
    this.displayActionButtons()
    return this.getUserDecision()
  }

  public resetTableView(): void {
    this._tableModel.resetGame()
    this._roundResultText.removeAll(true)
    this._drawCards.removeAll(true)
    this._actionButtons.removeAll(true)

    this.resetPlayerView()
  }

  private handleMoveToDeck(
    card1: CardView,
    card2: CardView,
    x: number,
    y: number,
    index: number
  ): void {
    const drawCards: CardView[] = this.moveDrawCardsToDeck(x, y)

    card1.setDepth(this.depth).animateCardMove(x, y)
    card2.setDepth(this.depth + 1).animateCardMove(x, y)
    this._playerViews[index].playerModel.addAcquiredCards(2 + drawCards.length)
    this._playerViews[index].animateAddOwnDeck([card1, card2, ...drawCards])
  }

  private moveDrawCardsToDeck(x: number, y: number): CardView[] {
    const drawCards: CardView[] = []

    this._drawCards.each((card: CardView) => {
      drawCards.push(card)
      card.animateCardMove(x, y)
      this._drawCards.remove(card)
    })

    return drawCards
  }

  // eslint-disable-next-line
  private setColorBattleResult(result: string): string {
    if (result === 'DRAW') {
      return '#c0c0c0'
    }
    return result === 'WIN!' ? '#00ff00' : '#ff8c00'
  }

  // eslint-disable-next-line
  private judgeRoundResult(
    botAcquired: number,
    playerAcquired: number
  ): string {
    if (playerAcquired === botAcquired) {
      return 'DRAW...'
    }
    return playerAcquired > botAcquired ? 'YOU WIN!' : 'YOU LOSE'
  }

  private displayActionButtons(): void {
    this._actionButtons = this.scene.add.container()
    const quitButton: Phaser.GameObjects.Container = this.createActionButton(
      this._sceneWidth / 2 - 70,
      this._sceneHeight / 2 + 70,
      'quit'
    )
    const continueButton: Phaser.GameObjects.Container =
      this.createActionButton(
        this._sceneWidth / 2 + 70,
        this._sceneHeight / 2 + 70,
        'continue'
      )

    this._actionButtons.add([quitButton, continueButton])
    this.add(this._actionButtons)
  }

  private getUserDecision(): Promise<string> {
    return new Promise((resolve) => {
      this._actionButtons.each((button: Phaser.GameObjects.Container) => {
        button.list[0].on('pointerdown', () => {
          resolve(button.list[1].name)
        })
      })
    })
  }

  private resetPlayerView(): void {
    this._playerViews.forEach((player: PlayerView) => {
      player.handCardViews.removeAll(true)
      player.acquiredCardViews.removeAll(true)
      player.cardCount?.destroy()
    })
  }

  private createPlayerViews(): void {
    const playersPos: { x: number; y: number }[] = [
      { x: 455, y: 100 },
      { x: 455, y: 550 }
    ]

    this._tableModel.players.forEach((player: WarPlayer, index: number) => {
      const playerView: PlayerView = new PlayerView(
        this.scene,
        player,
        playersPos[index]
      )
      this._playerViews.push(playerView)
      this.add(playerView)
    })
  }

  private createPromptText(): Phaser.GameObjects.Text {
    return this.scene.add
      .text(
        this._sceneWidth / 2 - 110,
        this._sceneHeight / 2 + 65,
        '(Please select one card)'
      )
      .setVisible(false)
  }

  private createActionButton(
    x: number,
    y: number,
    actionText: string
  ): Phaser.GameObjects.Container {
    const container: Phaser.GameObjects.Container = this.scene.add.container()
    const button: Phaser.GameObjects.Image = this.createButton(x, y)
    const text: Phaser.GameObjects.Text = this.createText(
      x,
      y,
      actionText
    ).setName(actionText)

    container.add([button, text])
    return container
  }

  private createButton(x: number, y: number): Phaser.GameObjects.Image {
    const button = this.scene.add.image(x, y, 'btn-dark')
    button.setScale(1.3, 0.8)
    button.setInteractive({ useHandCursor: true })
    button.on('pointerover', () => button.setScale(1.4, 0.9))
    button.on('pointerout', () => button.setScale(1.3, 0.8))

    return button
  }

  private createText(
    x: number,
    y: number,
    content: string
  ): Phaser.GameObjects.Text {
    const text: Phaser.GameObjects.Text = this.scene.add.text(
      x,
      y,
      content.toUpperCase(),
      { font: '16px' }
    )
    text.setOrigin(0.5, 0.5)
    text.setName(content)

    return text
  }

  get playerViews(): PlayerView[] {
    return this._playerViews
  }
}
