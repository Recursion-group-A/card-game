import Card from '@/models/common/Card'
import WarTable from '@/models/war/WarTable'
import BaseScene from '@/phaser/common/BaseScene'
import CardView from '@/phaser/common/CardView'
import PlayerView from '@/phaser/war/PlayerView'
import TableView from '@/phaser/war/TableView'
import { Rank } from '@/types/common/rank-types'
import { GameTypes } from '@/types/common/game-types'
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

  update(): void {
    this._tableView?.update()
  }

  private async startGameLoop(): Promise<void> {
    await this.startGame()
  }

  // eslint-disable-next-line
  protected async startGame(): Promise<void> {
    await this.processBeforeBattle()
    await this.processBattle()
    // await this.prepareNextGame()
  }

  // eslint-disable-next-line
  protected prepareNextGame(): Promise<void> {
    return Promise.resolve(undefined)
  }

  private async processBeforeBattle(): Promise<void> {
    await delay(WarScene.DELAY_TIME / 2)
    await this.dealCardsToPlayers()
  }

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

  private async processBattle(): Promise<void> {
    const playerCard: CardView = await this.processPlayerAction()
    const botCard: CardView = await this.processBotAction()

    await delay(WarScene.DELAY_TIME / 2)
    playerCard.open()
    botCard.open()

    this.processJudgement(playerCard, botCard)
  }

  private async processPlayerAction(): Promise<CardView> {
    const card: CardView = await this._playerViews[1].getUserAction()
    card.animateWarCardMove(true)

    return card
  }

  private async processBotAction(): Promise<CardView> {
    const card: CardView = this.selectCard()
    card.animateWarCardMove(false)

    return card
  }

  private selectCard(): CardView {
    const numOfCards: number =
      this._playerViews[0].playerModel.hand.getCardCount()
    const randomInt: number = Math.floor(Math.random() * numOfCards)

    return this._playerViews[0].handCardViews.getAt(randomInt)
  }

  private processJudgement(card1: CardView, card2: CardView): void {
    const card1Rank: Rank = card1.cardModel.rank
    const card2Rank: Rank = card2.cardModel.rank

    if (card1Rank === card2Rank) {
      this._tableView?.displayResultText('DRAW')
    } else if (card1Rank > card2Rank) {
      this._tableView?.displayResultText('WIN!')
    } else {
      this._tableView?.displayResultText('LOSE')
    }
  }
}
