import Phaser from 'phaser'
import Table from '@/models/blackjack/Table'
import TableView from '@/phaser/blackjack/TableView'
import { GAMETYPE } from '@/types/gameTypes'
import BaseScene from '@/phaser/common/BaseScene'

// PreloadSceneのコードを書き換えることでブラックジャックにできる

export default class BlackjackScene extends BaseScene {
  private _tableView: TableView | undefined

  private readonly _tableModel: Table

  constructor() {
    super('BlackjackScene')
    
    this._tableModel = new Table(GAMETYPE.Blackjack, 6)
  }

  public create(): void {
    this._tableView = new TableView(this, this._tableModel)
    // this._tableView.assignDealerBtn()
    // this._tableView.animateCollectBlinds()

    this.time.delayedCall(2500, () => {
      this._tableView?.startGame()
    })
  }
}
