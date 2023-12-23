import BlackjackTable from '@/models/blackjack/BlackjackTable'
import TableView from '@/phaser/blackjack/TableView'
import { GAMETYPE } from '@/types/common/gameTypes'
import BaseScene from '@/phaser/common/BaseScene'

// PreloadSceneのコードを書き換えることでブラックジャックにできる

export default class BlackjackScene extends BaseScene {
  private _tableView: TableView | undefined

  private readonly _tableModel: BlackjackTable

  constructor() {
    super('BlackjackScene')

    this._tableModel = new BlackjackTable(GAMETYPE.Blackjack)
  }

  public create(): void {
    super.create()

    this._tableView = new TableView(this, this._tableModel, GAMETYPE.Blackjack)
    // this._tableView.assignDealerBtn()
    // this._tableView.animateCollectBlinds()

    this.time.delayedCall(2500, () => {
      this._tableView?.startGame()
    })
  }
}
