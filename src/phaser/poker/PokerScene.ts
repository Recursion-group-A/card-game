import Phaser from 'phaser'
import Table from '@/models/poker/Table'
import TableView from '@/phaser/poker/TableView'
import { GAMETYPE } from '@/types/gameTypes'

export default class PokerScene extends Phaser.Scene {
  private tableView: TableView | undefined

  private readonly tableModel: Table

  constructor() {
    super('PokerScene')
    this.tableModel = new Table(GAMETYPE.Poker)
  }

  public create(): void {
    this.tableView = new TableView(this, this.tableModel)
  }
}
