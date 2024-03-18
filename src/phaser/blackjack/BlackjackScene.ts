import House from '@/models/blackjack/House'
import BlackjackPlayer from '@/models/blackjack/BlackjackPlayer'
import BlackjackTable from '@/models/blackjack/BlackjackTable'
import BaseScene from '@/phaser/common/BaseScene'
import HouseView from '@/phaser/blackjack/HouseView'
import PlayerView from '@/phaser/blackjack/PlayerView'
import TableView from '@/phaser/blackjack/TableView'
import PlayerTypes from '@/types/common/player-types'
import { GameTypes } from '@/types/common/game-types'
import { delay } from '@/utils/utils'

export default class BlackjackScene extends BaseScene {
  private readonly _tableModel: BlackjackTable

  private _tableView: TableView | undefined

  private _playerViews: PlayerView[] = []

  private _houseView: HouseView | undefined

  constructor() {
    super('BlackjackScene')

    this._tableModel = new BlackjackTable(GameTypes.Blackjack)
  }

  async create(): Promise<void> {
    super.create()

    this._tableView = new TableView(this, this._tableModel)
    this._playerViews = this._tableView.playerViews
    this._houseView = this._tableView.houseView

    await this.startGameLoop()
  }

  update(): void {
    this._tableView?.update()
  }

  private async startGameLoop(): Promise<void> {
    while (this.isGameActive) {
      await this.startGame() // eslint-disable-line
    }
    this.redirectToHomePage()
  }

  private async startGame(): Promise<void> {
    await this.processBetting()
    await this.processActing()
    await this.processEvaluating()
    await this.processSettlement()
    await this.prepareNextGame()
  }

  private async processBetting(): Promise<void> {
    this.decidePlayersBetAmount()
    this._tableView?.createBetButtons()
    this._tableView?.getUserBetAction()
  }

  private decidePlayersBetAmount(): void {
    this._tableModel.decideAiPlayersBetAmount()

    this.updatePlayersBet()
    this.updatePlayersChips()
  }

  private updatePlayersChips(): void {
    this._playerViews.forEach((playerView) => {
      playerView.updateChips()
    })
  }

  private updatePlayersBet(): void {
    this._playerViews.forEach((playerView) => {
      playerView.updateBet()
    })
  }

  private async processActing(): Promise<void> {
    await BlackjackScene.waitForCompletion(
      () => this._tableModel.userBetCompleted
    )

    this._tableModel.setActingPhase()

    await this.dealCardsToParticipants()
    await delay(BlackjackScene.DELAY_TIME)
    this.revealAllHand()

    this._tableModel.initializeParticipantsStatus()
    this.updatePlayersStatus()
    this.updatePlayersScore()

    await delay(BlackjackScene.DELAY_TIME)
    this._tableView?.createActionButtons()
    await this._tableView?.getUserBlackjackAction()
    await this.processAiAction()
    await this.processHouseAction()
  }

  private static async waitForCompletion(
    condition: () => boolean
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      const checkCompletion = () => {
        if (condition()) {
          resolve()
        } else {
          setTimeout(checkCompletion, BlackjackScene.DELAY_TIME)
        }
      }

      checkCompletion()
    })
  }

  private async dealCardsToParticipants(): Promise<void> {
    let count = 0
    for (let times: number = 0; times < 2; times += 1) {
      // eslint-disable-next-line
      for (const playerView of this._playerViews) {
        if (!playerView.playerModel.isBroken()) {
          // eslint-disable-next-line
          await delay(BlackjackScene.DELAY_TIME / 10)
          this._tableView?.addCardToHand(playerView.playerModel, playerView)
        }

        count += 1
      }

      if (count >= this._playerViews.length) {
        // eslint-disable-next-line
        await delay(BlackjackScene.DELAY_TIME / 10)
        const houseView: HouseView = this._houseView!
        this._tableView?.addCardToHand(houseView.houseModel, houseView)
      }
    }
  }

  private revealAllHand(): void {
    this.revealParticipantsHand()
    this._houseView?.revealFirstHand()
  }

  private revealParticipantsHand(): void {
    this._playerViews.forEach((player: PlayerView) => {
      player.revealHand()
    })
  }

  private updatePlayersStatus(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      if (playerView.playerModel.isBlackjack())
        playerView.updateBlackjackColor()
      playerView.updateStatus()
    })
  }

  private updatePlayersScore(): void {
    this._playerViews.forEach((playerView) => {
      playerView.updateScore()
    })
  }

  private async processAiAction(): Promise<void> {
    // eslint-disable-next-line
    for (const player of this._playerViews) {
      if (player.playerModel.playerType === PlayerTypes.Ai) {
        // eslint-disable-next-line
        await this.drawUntilSeventeen(player.playerModel, player)
      }
    }
  }

  private async processHouseAction(): Promise<void> {
    await BlackjackScene.waitForCompletion(() => this._tableModel.isHouseTurn())
    await delay(BlackjackScene.DELAY_TIME)

    const houseView: HouseView = this._houseView!

    houseView.revealLastHand()
    houseView.updateStatus()
    houseView.updateScore()

    const { houseModel } = houseView
    if (houseModel.isBlackjack()) {
      houseView.updateBlackjackColor()
    } else {
      await this.drawUntilSeventeen(houseModel, houseView)
    }
  }

  private async processEvaluating(): Promise<void> {
    await BlackjackScene.waitForCompletion(() =>
      this._tableModel.houseActionCompleted()
    )

    await delay(BlackjackScene.DELAY_TIME)

    this._tableModel.setEvaluatingPhase()
    this._tableModel.evaluatingPlayers()

    this.updatePlayersGameResult()
    await delay(BlackjackScene.DELAY_TIME * 3)
    this.removePlayersGameResult()
  }

  private updatePlayersGameResult(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      playerView.updateGameResult()
    })
  }

  private removePlayersGameResult(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      playerView.removeGameResult()
    })
  }

  private async processSettlement(): Promise<void> {
    await BlackjackScene.waitForCompletion(
      () => this._tableModel.evaluateCompleted
    )

    this._tableModel.setSettlementPhase()
    this._tableModel.settlementPlayers()

    this.updatePlayersChips()
    this.updatePlayersBet()
  }

  private async prepareNextGame(): Promise<void> {
    await BlackjackScene.waitForCompletion(
      () => this._tableModel.settlementCompleted
    )

    this._tableModel.setPreparationPhase()
    this._tableModel.prepareNextRound()
    this.updatePlayersStatus()
    this.updatePlayersScore()
    this.resetBlackjackPlayerColor()
    this._houseView?.updateStatus()
    this._houseView?.updateScore()
    this.removePlayersCards()
    this._houseView?.removeAllCards()

    await delay(BlackjackScene.DELAY_TIME * 3)
  }

  private removePlayersCards(): void {
    this._playerViews.forEach((playerView: PlayerView) =>
      playerView.removeAllCards()
    )
  }

  private resetBlackjackPlayerColor(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      playerView.resetBlackjackColor()
    })
  }

  private async drawUntilSeventeen(
    model: BlackjackPlayer | House,
    view: PlayerView | HouseView
  ): Promise<void> {
    while (model.getHandTotalScore() < 17) {
      // eslint-disable-next-line
      await delay(BlackjackScene.DELAY_TIME)

      this._tableView?.addCardToHand(model, view)
      view.revealLastHand()

      if (model.getHandTotalScore() > 21) {
        model.bust()
        view.updateStatus()
      } else if (model.getHandTotalScore() >= 17) {
        model.stand()
        view.updateStatus()
      }

      view.updateScore()
    }
  }
}
