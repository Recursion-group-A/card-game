import Phaser from 'phaser'
import Table from '@/models/poker/Table'
import TableView from '@/phaser/poker/TableView'
import { GAMETYPE } from '@/types/gameTypes'

export default class PokerScene extends Phaser.Scene {
  private _tableView: TableView | undefined

  private readonly _tableModel: Table

  constructor() {
    super('PokerScene')
    this._tableModel = new Table(GAMETYPE.Poker)
  }

  public create(): void {
    this._tableView = new TableView(this, this._tableModel)
    this._tableView.assignDealerBtn()
    this._tableView.animateCollectBlinds()

    this.time.delayedCall(2500, () => {
      this._tableView?.dealCardAnimation()
      this._tableView?.revealUserHand()
    })
  }
}
