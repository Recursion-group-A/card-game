import BaseScene from '@/phaser/common/BaseScene'
import BlackjackTable from '@/models/blackjack/BlackjackTable'
import TableView from '@/phaser/blackjack/TableView'
import { GameTypes } from '@/types/common/game-types'

export default class BlackjackScene extends BaseScene {
  private _tableView: TableView | undefined

  private readonly _tableModel: BlackjackTable

  constructor() {
    super('BlackjackScene')

    this._tableModel = new BlackjackTable(GameTypes.Blackjack)
  }

  create(): void {
    super.create()

    this._tableView = new TableView(this, this._tableModel)

    this.time.delayedCall(BlackjackScene.DELAY_TIME, () => {
      this._tableView?.startGame()
    })
  }

  // eslint-disable-next-line
  protected startGame(): Promise<void> {
    return Promise.resolve(undefined)
  }

  // eslint-disable-next-line
  protected prepareNextGame(): Promise<void> {
    return Promise.resolve(undefined)
  }
}
