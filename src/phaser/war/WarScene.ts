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

  private _botView: PlayerView | undefined

  private _playerView: PlayerView | undefined

  constructor() {
    super('WarScene')

    this._tableModel = new WarTable(GameTypes.War)
  }

  async create(): Promise<void> {
    super.create()

    this._tableView = new TableView(this, this._tableModel)
    const { playerViews } = this._tableView
    ;[this._botView, this._playerView] = playerViews

    await this.startGameLoop()
  }

  update(): void {
    this._tableView?.update()
  }

  protected async startGame(): Promise<void> {
    await this.processBeforeRound()
    await this.processRound()
    await this.processBetweenRounds()
    this.prepareNextRound()
  }

  private async startGameLoop(): Promise<void> {
    while (this.isGameActive) {
      await this.startGame() // eslint-disable-line
    }
    this.redirectToHomePage()
  }

  private async processBeforeRound(): Promise<void> {
    await delay(WarScene.DELAY_TIME / 2)
    await this.dealCardsToPlayers()
    await delay(WarScene.DELAY_TIME)
    if (this._tableModel.isFirstTime) {
      this._tableView?.displayPromptText()
      this._tableModel.isFirstTime = false
    }
  }

  private async dealCardsToPlayers(): Promise<void> {
    for (let i: number = 0; i < 26; i += 1) {
      const card1: Card = this._tableModel.drawCard()
      const card2: Card = this._tableModel.drawCard()

      this._botView?.playerModel.addHand(card1)
      this._botView?.animateAddHand(330, 160, card1, i)

      this._playerView?.playerModel.addHand(card2)
      this._playerView?.animateAddHand(330, 610, card2, i)
    }
  }

  private async processRound(): Promise<void> {
    for (let i: number = 0; i < 26; i += 1) {
      await this.processEachBattle() // eslint-disable-line
    }
  }

  private async processEachBattle(): Promise<void> {
    const x: number = this.cameras.main.width / 2
    const y: number = this.cameras.main.height / 2

    const playerCard: CardView = await this.processPlayerAction(x, y)
    const botCard: CardView = await this.processBotAction(x, y)

    this.playSoundEffect('gun')
    await delay(WarScene.DELAY_TIME / 4)
    this.playSoundEffect('sword')

    playerCard.open()
    botCard.open()

    await delay(WarScene.DELAY_TIME / 2)
    await this.processJudgement(playerCard, botCard)
  }

  private async processPlayerAction(x: number, y: number): Promise<CardView> {
    const card: CardView = await this._playerView!.getUserAction()

    card.animateCardMove(x, y + 50, 200)
    this._playerView?.playerModel.hand.popOne(card.cardModel)
    this._playerView?.handCardViews.remove(card)
    this._tableView?.setVisiblePromptText(false)

    return card
  }

  private async processBotAction(x: number, y: number): Promise<CardView> {
    const card: CardView = this.selectCard()

    card.animateCardMove(x, y - 50, 200)
    this._botView?.playerModel.hand.popOne(card.cardModel)
    this._botView?.handCardViews.remove(card)

    return card
  }

  private selectCard(): CardView {
    const numOfCards: number = this._botView!.playerModel.hand.getCardCount()
    const randomInt: number = Math.floor(Math.random() * numOfCards)
    return this._botView!.handCardViews.getAt(randomInt)
  }

  private async processJudgement(
    card1: CardView,
    card2: CardView
  ): Promise<void> {
    const playerRank: number = card1.cardModel.getRankNumber()
    const botRank: number = card2.cardModel.getRankNumber()

    let resultText: string
    let resultIndex: number

    if (playerRank === botRank) {
      resultText = 'DRAW'
      resultIndex = 2
    } else if (playerRank > botRank) {
      resultText = 'WIN!'
      resultIndex = 1
    } else {
      resultText = 'LOSE'
      resultIndex = 0
    }

    this._tableView?.displayBattleResultText(resultText)
    await delay(WarScene.DELAY_TIME / 2)
    this._tableView?.animateMoveToDeck(card1, card2, resultIndex)
  }

  private async processBetweenRounds(): Promise<void> {
    this._tableView?.displayRoundResult()
    await delay(WarScene.DELAY_TIME)
    await this.processUserDecision()
  }

  private async processUserDecision(): Promise<void> {
    const userDecision: string | undefined =
      await this._tableView?.promptUserDecision()
    if (userDecision === 'quit') {
      this.redirectToHomePage()
    }
  }

  private prepareNextRound(): void {
    this._tableView?.resetTableView()
  }
}
