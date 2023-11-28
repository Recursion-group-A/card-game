import Table from '@/models/poker/Table'
import { GAMETYPE } from '@/types/gameTypes'

export default class Controller {
  private table: Table

  constructor(gameType: GAMETYPE) {
    this.table = new Table(gameType)
  }

  public startPoker(): void {
    this.table.assignRandomDealerButton()
    this.table.collectBlinds()
    this.table.dealCardsToPlayers()
  }

  public async startPreFlopRound(): Promise<void> {
    const startingIndex: number = this.table.getUtgIndex()

    await this.table.startRound(startingIndex, 0)
    this.table.checkForWinner()
  }

  public async startFlopRound(): Promise<void> {
    const startingIndex: number = this.table.getSbIndex()

    await this.table.startRound(startingIndex, 3)
    this.table.checkForWinner()
  }

  public async startTurnRound(): Promise<void> {
    const startingIndex: number = this.table.getSbIndex()

    await this.table.startRound(startingIndex, 1)
    this.table.checkForWinner()
  }

  public async startRiverRound(): Promise<void> {
    const startingIndex: number = this.table.getSbIndex()

    await this.table.startRound(startingIndex, 1)
    this.table.checkForWinner()
  }

  public showDown(): void {
    this.table.showDown()
  }
}
