import BaseScene from '@/phaser/common/BaseScene'
import TableView from '@/phaser/war/TableView'
import PlayerView from '@/phaser/war/PlayerView'
import WarTable from '@/models/war/WarTable'
import { GameTypes } from '@/types/common/game-types'
import Card from '@/models/common/Card'
import { delay } from '@/utils/utils'

export default class WarScene extends BaseScene {
  private readonly _tableModel: WarTable

  private _tableView: TableView | undefined

  private _playerViews: PlayerView[] = []

  constructor() {
    super('WarScene')

    this._tableModel = new WarTable(GameTypes.War)
  }

  async create(): Promise<void> {
    super.create()

    this._tableView = new TableView(this, this._tableModel)
    this._playerViews = this._tableView.playerViews

    await this.startGameLoop()
  }

  update() {
    this._tableView?.update()
  }

  private async startGameLoop(): Promise<void> {
    while (this.isGameActive) {
      await this.startGame() // eslint-disable-line
    }
  }

  // eslint-disable-next-line
  protected async startGame(): Promise<void> {
    // await this.processBeforeBattle()
    // await this.processBattle()
    // await this.processJudgement()
    // await this.prepareNextGame()
  }

  // eslint-disable-next-line
  protected prepareNextGame(): Promise<void> {
    return Promise.resolve(undefined)
  }

  // private async processBeforeBattle(): Promise<void> {
  //   await this.dealCardsToPlayers()
  // }

  private async dealCardsToPlayers(): Promise<void> {
    for (let c: number = 0; c < 26; c += 1) {
      const card1: Card = this._tableModel.drawCard()
      const card2: Card = this._tableModel.drawCard()

      // eslint-disable-next-line
      await delay(WarScene.DELAY_TIME / 30)

      this._playerViews[0].playerModel.addHand(card1)
      this._playerViews[0].animateAddHand(330, 160, card1, c)

      this._playerViews[1].playerModel.addHand(card2)
      this._playerViews[1].animateAddHand(330, 610, card2, c)
    }
  }

  // private async processBattle(): Promise<void> {}

  // private async processJudgement(): Promise<void> {}
}
