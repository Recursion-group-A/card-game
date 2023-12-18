import Phaser from 'phaser'
import Table from '@/models/poker/Table'
import TableView from '@/phaser/poker/TableView'
import { GAMETYPE } from '@/types/gameTypes'

export default class PokerScene extends Phaser.Scene {
  private _tableView: TableView | undefined

  constructor() {
    super('PokerScene')
  }

  async create(): Promise<void> {
    this._tableView = new TableView(this, new Table(GAMETYPE.Poker))
    this._tableView.assignDealerBtn(true)

    // eslint-disable-next-line
    while (true) {
      // eslint-disable-next-line
      await this._tableView.startGame()

      this._tableView.displayPromptText()
      // eslint-disable-next-line
      await this._tableView.waitForUserClick()
      this._tableView.destroyPromptText()

      this._tableView.resetGameView()
      this._tableView.assignDealerBtn(false)
    }
  }

  update() {
    this._tableView?.update()
  }
}
