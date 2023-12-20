import BaseScene from '@/phaser/common/BaseScene'
import TableView from '@/phaser/poker/TableView'
import { GAMETYPE } from '@/types/gameTypes'

export default class PokerScene extends BaseScene {
  private _tableView: TableView | undefined

  constructor() {
    super('PokerScene')
  }

  async create(): Promise<void> {
    super.create()

    this._tableView = new TableView(this, GAMETYPE.Poker)

    // eslint-disable-next-line
    while (true) {
      await this._tableView.startGame() // eslint-disable-line
    }
  }

  update() {
    this._tableView?.update()
  }
}
