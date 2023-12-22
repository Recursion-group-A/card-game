import Table from '@/models/common/Table'
import { GAMETYPE } from '@/types/gameTypes'

export default class Controller {
  private table: Table

  constructor(gameType: GAMETYPE, playerNumber: number) {
    this.table = new Table(gameType, playerNumber)
  }

  // スタートボタンを押したときのメソッド
  public startGame(): void {
    this.table.startGame()
  }

  public prepareForNextRound(): void {
    this.table.prepareForNextRound()
  }

  public addPlayerBet(amount: number): void {
    this.table.addPlayerBet(amount)
  }

  public resetPlayerBet(): void {
    this.table.resetPlayerBet()
  }

  public changeHouseTurn(): void {
    this.table.changeHouseTurn()
  }

  public changeAiPlayerTurn(): void {
    this.table.changeAiPlayerTurn()
  }

  public settlementPlayers(): void {
    this.table.settlementPlayers()
  }

  public standProcess(): void {
    this.table.standProcess()
  }

  public hitProcess(): void {
    this.table.hitProcess()
  }

  public doubleProcess(): void {
    this.table.doubleProcess()
  }

  public surrenderProcess(): void {
    this.table.surrenderProcess()
  }
}
