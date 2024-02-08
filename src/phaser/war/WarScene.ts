import Card from '@/models/common/Card'
import WarTable from '@/models/war/WarTable'
import BaseScene from '@/phaser/common/BaseScene'
import CardView from '@/phaser/common/CardView'
import PlayerView from '@/phaser/war/PlayerView'
import TableView from '@/phaser/war/TableView'
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

  protected async startGame(): Promise<void> {
    await this.processBeforeBattle()
    await this.processRound()
    await this.prepareNextGame()
  }

  // eslint-disable-next-line
  protected async prepareNextGame(): Promise<void> {}

  private async processBeforeBattle(): Promise<void> {
    await delay(WarScene.DELAY_TIME / 2)
    await this.dealCardsToPlayers()
  }

  private async dealCardsToPlayers(): Promise<void> {
    for (let i: number = 0; i < 26; i += 1) {
      const card1: Card = this._tableModel.drawCard()
      const card2: Card = this._tableModel.drawCard()

      this._playerViews[0].playerModel.addHand(card1)
      this._playerViews[0].animateAddHand(330, 160, card1, i)

      this._playerViews[1].playerModel.addHand(card2)
      this._playerViews[1].animateAddHand(330, 610, card2, i)
    }
  }

  private async processRound(): Promise<void> {
    for (let i: number = 0; i < 26; i += 1) {
      // eslint-disable-next-line
      await this.processEachBattle()
    }
  }

  private async processEachBattle(): Promise<void> {
    const playerCard: CardView = await this.processPlayerAction()
    const botCard: CardView = await this.processBotAction()

    await delay(WarScene.DELAY_TIME / 2)
    playerCard.open()
    botCard.open()

    await delay(WarScene.DELAY_TIME / 2)
    await this.processJudgement(playerCard, botCard)
  }

  private async processPlayerAction(): Promise<CardView> {
    const player: PlayerView = this._playerViews[1]
    const card: CardView = await player.getUserAction()

    player.playerModel.hand.popOne(card.cardModel)
    card.animateWarCardMove(true)

    return card
  }

  private async processBotAction(): Promise<CardView> {
    const bot: PlayerView = this._playerViews[0]
    const card: CardView = this.selectCard(bot)

    bot.playerModel.hand.popOne(card.cardModel)
    bot.handCardViews.remove(card)
    card.animateWarCardMove(false)

    return card
  }

  // eslint-disable-next-line
  private selectCard(bot: PlayerView): CardView {
    const numOfCards: number = bot.playerModel.hand.getCardCount()
    const randomInt: number = Math.floor(Math.random() * numOfCards)

    return bot.handCardViews.getAt(randomInt)
  }

  private async processJudgement(
    card1: CardView,
    card2: CardView
  ): Promise<void> {
    const card1Rank: number = card1.cardModel.getRankNumber()
    const card2Rank: number = card2.cardModel.getRankNumber()

    let resultText: string
    let resultIndex: number

    if (card1Rank === card2Rank) {
      resultText = 'DRAW'
      resultIndex = 2
    } else if (card1Rank > card2Rank) {
      resultText = 'WIN!'
      resultIndex = 1
    } else {
      resultText = 'LOSE'
      resultIndex = 0
    }

    this._tableView?.displayResultText(resultText)
    await delay(WarScene.DELAY_TIME / 2)
    this._tableView?.animateMoveToDeck(card1, card2, resultIndex)
  }
}
