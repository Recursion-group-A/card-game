import BaseScene from '@/phaser/common/BaseScene'
import BlackjackTable from '@/models/blackjack/BlackjackTable'
import TableView from '@/phaser/blackjack/TableView'
import { GameTypes } from '@/types/common/game-types'
import BaseScene from '@/phaser/common/BaseScene'

// PreloadSceneのコードを書き換えることでブラックジャックにできる

export default class BlackjackScene extends BaseScene {
  private _tableView: TableView | undefined

  private readonly _tableModel: BlackjackTable

  constructor() {
    super('BlackjackScene')

    this._tableModel = new BlackjackTable(GameTypes.Blackjack)
  }

  public create(): void {
    super.create()

    this._tableView = new TableView(this, this._tableModel)
    // this._tableView.assignDealerBtn()
    // this._tableView.animateCollectBlinds()

    this.time.delayedCall(2500, () => {
      this._tableView?.startGame()
    })
  }
}
