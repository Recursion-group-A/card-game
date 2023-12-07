import Table from '@/models/poker/Table'
import TableView from '@/phaser/poker/TableView'
import { GAMETYPE } from '@/types/gameTypes'

export default class Controller {
  private table: Table

  private tableView: TableView | undefined

  constructor(gameType: GAMETYPE, tableView: TableView | undefined) {
    this.table = new Table(gameType)
    this.tableView = tableView
  }

  public startPoker(): void {
    this.table.assignRandomDealerButton()
    this.table.collectBlinds()
    this.table.dealCardsToPlayers()
  }

  public async startPreFlopRound(): Promise<void> {
    const startingIndex: number = this.table.utgIndex

    await this.table.startRound(startingIndex, 0)
    this.table.checkForWinner()
  }

  public async startFlopRound(): Promise<void> {
    const startingIndex: number = this.table.sbIndex

    await this.table.startRound(startingIndex, 3)
    this.table.checkForWinner()
  }

  public async startTurnRound(): Promise<void> {
    const startingIndex: number = this.table.sbIndex

    await this.table.startRound(startingIndex, 1)
    this.table.checkForWinner()
  }

  public async startRiverRound(): Promise<void> {
    const startingIndex: number = this.table.sbIndex

    await this.table.startRound(startingIndex, 1)
    this.table.checkForWinner()
  }

  public showDown(): void {
    this.table.showDown()
  }
}
