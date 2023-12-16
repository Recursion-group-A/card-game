import Phaser from 'phaser'
import Table from '@/models/poker/Table'
import TableView from '@/phaser/poker/TableView'
import { GAMETYPE } from '@/types/gameTypes'
import { delay } from '@/utils/utils'

export default class PokerScene extends Phaser.Scene {
  private _tableView: TableView | undefined

  private readonly _tableModel: Table

  constructor() {
    super('PokerScene')
    this._tableModel = new Table(GAMETYPE.Poker)
  }

  public async create(): Promise<void> {
    this._tableView = new TableView(this, this._tableModel)
    this._tableView.assignDealerBtn()

    await delay(1500)

    await this._tableView.animateCollectBlinds()

    await delay(1500)

    await this._tableView.dealCardToPlayers()

    await delay(1000)

    this._tableView.revealUserHand()

    await delay(1000)

    const preFlopStartIndex: number = this._tableModel.utgIndex
    await this._tableView.startRound(preFlopStartIndex, 3)

    await delay(1000)

    const flopStartIndex: number = this._tableModel.sbIndex
    await this._tableView.startRound(flopStartIndex, 1)

    await delay(1000)

    const turnStartIndex: number = this._tableModel.sbIndex
    await this._tableView.startRound(turnStartIndex, 1)

    await delay(1000)

    const riverStartIndex: number = this._tableModel.sbIndex
    await this._tableView.startRound(riverStartIndex, 0)

    await delay(1000)

    this._tableView.showDown()
  }

  update() {
    this._tableView?.update()
  }
}
