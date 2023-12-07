import Phaser from 'phaser'
import Table from '@/models/poker/Table'
import Player from '@/models/poker/Player'
import PlayerView from '@/phaser/poker/PlayerView'
import DeckView from '@/phaser/common/DeckView'
import Deck from '@/models/common/Deck'

export default class TableView extends Phaser.GameObjects.Container {
  private tableModel: Table

  private readonly playersModel: Player[]

  private readonly playerViews: PlayerView[] | undefined

  private readonly deckView: DeckView

  private readonly deckModel: Deck

  private readonly background: Phaser.GameObjects.Image

  private sceneWidth: number = this.scene.cameras.main.width

  private sceneHeight: number = this.scene.cameras.main.height

  constructor(scene: Phaser.Scene, tableModel: Table) {
    super(scene)
    this.tableModel = tableModel
    this.playersModel = this.tableModel.players
    this.deckModel = this.tableModel.deck
    this.deckView = new DeckView(
      this.scene,
      this.sceneWidth - 50,
      -50,
      new Deck(this.tableModel.gameType)
    )
    this.background = this.scene.add.image(
      this.sceneWidth / 2,
      this.sceneHeight / 2,
      'table'
    )

    this.add([this.background, this.deckView])

    const playerPositions: { x: number; y: number }[] = [
      { x: 150, y: 100 },
      { x: 450, y: 100 },
      { x: 750, y: 100 },
      { x: 150, y: 350 },
      { x: 750, y: 350 },
      { x: 450, y: 550 }
    ]

    this.playersModel.forEach((player: Player, index: number) => {
      const pos: { x: number; y: number } = playerPositions[index]
      const playerView = new PlayerView(this.scene, pos.x, pos.y, player)
      this.add(playerView)
      this.playerViews?.push(playerView)
    })

    scene.add.existing(this)
  }
}
