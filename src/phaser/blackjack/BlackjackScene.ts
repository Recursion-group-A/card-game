import BaseScene from '@/phaser/common/BaseScene'
import BlackjackTable from '@/models/blackjack/BlackjackTable'
import TableView from '@/phaser/blackjack/TableView'
import PlayerView from '@/phaser/blackjack/PlayerView'
import { GameTypes } from '@/types/common/game-types'

export default class BlackjackScene extends BaseScene {
  private readonly _tableModel: BlackjackTable

  private _tableView: TableView | undefined

  private _playerViews: PlayerView[] = []

  private readonly _isGameActive: boolean

  constructor() {
    super('BlackjackScene')

    this._tableModel = new BlackjackTable(GameTypes.Blackjack)
    this._isGameActive = true
  }

  public create(): void {
    super.create()

    this._tableView = new TableView(this, this._tableModel)
    this._playerViews = this._tableView.playerViews

    this.time.delayedCall(2500, () => {
      this._tableView?.startGame()
    })
  }
}
