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

  private _resultBattleText: Phaser.GameObjects.Text | null = null

  private _drawCards: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene, tableModel: WarTable) {
    super(scene)

    this._tableModel = tableModel
    this.createPlayerViews()
    this._drawCards = this.scene.add.container()

    scene.add.existing(this)
  }

  update(): void {
    this._playerViews.forEach((player: PlayerView) => {
      player.update()
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

  public displayResultText(text: string): void {
    this._resultBattleText = this.scene.add.text(
      this._sceneWidth / 2 - 25,
      this._sceneHeight / 2 - 11,
      text,
      { font: '20px' }
    )

    this.add(this._resultBattleText)
    this.scene.time.delayedCall(800, () => this._resultBattleText?.destroy())
  }

  public animateMoveToDeck(
    card1: CardView,
    card2: CardView,
    index: number
  ): void {
    this.setVisibleCardCount()
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

  private handleMoveToDeck(
    card1: CardView,
    card2: CardView,
    x: number,
    y: number,
    index: number
  ): void {
    const numOfDrawCards: number = this.addDrawCardsToDeck(x, y)

    card1.setDepth(this.depth).animateCardMove(x, y)
    card2.setDepth(this.depth + 1).animateCardMove(x, y)
    this._playerViews[index].playerModel.addAcquiredCards(2 + numOfDrawCards)
  }

  private addDrawCardsToDeck(x: number, y: number): number {
    let numOfDrawCard: number = 0

    this._drawCards.each((card: CardView) => {
      card.animateCardMove(x, y)
      this._drawCards.remove(card)
      numOfDrawCard += 1
    })
    return numOfDrawCard
  }

  private setVisibleCardCount(): void {
    this._playerViews.forEach((player: PlayerView) => {
      player.cardCount.setVisible(true)
    })
  }

  get playerViews(): PlayerView[] {
    return this._playerViews
  }
}
