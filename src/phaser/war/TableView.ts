import * as Phaser from 'phaser'
import WarTable from '@/models/war/WarTable'
import PlayerView from '@/phaser/war/PlayerView'
import WarPlayer from '@/models/war/WarPlayer'

export default class TableView extends Phaser.GameObjects.Container {
  private readonly _sceneWidth: number = this.scene.cameras.main.width

  private readonly _sceneHeight: number = this.scene.cameras.main.height

  private readonly _tableModel: WarTable

  private readonly _playerViews: PlayerView[] = []

  // private readonly _promptText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, tableModel: WarTable) {
    super(scene)

    this._tableModel = tableModel
    // this._promptText = this.createPromptText()
    this.createPlayerViews()

    this.add([
      // this._promptText
    ])

    scene.add.existing(this)
  }

  // update() {}

  private createPlayerViews(): void {
    const playersPos: { x: number; y: number }[] = [
      { x: 455, y: 100 },
      { x: 455, y: 550 }
    ]

    this._tableModel.players.forEach((player: WarPlayer, index: number) => {
      const playerView: PlayerView = new PlayerView(
        this.scene,
        player,
        playersPos[index],
        index
      )
      this._playerViews.push(playerView)
      this.add(playerView)
    })
  }

  get playerViews(): PlayerView[] {
    return this._playerViews
  }
}
