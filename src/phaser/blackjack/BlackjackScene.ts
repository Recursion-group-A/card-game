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

  private _houseView: HouseView[] = []

  constructor() {
    super('BlackjackScene')

    this._tableModel = new BlackjackTable(GameTypes.Blackjack)
  }

  async create(): Promise<void> {
    super.create()

    this._tableView = new TableView(this, this._tableModel)
    this._playerViews = this._tableView.playerViews
    this._houseView = this._tableView.houseView

    await this.startGame()
  }

  protected async startGame(): Promise<void> {
    await this.bettingProcess()
    await this.actingProcess()
    await this.evaluatingProcess()
    await this.settlementProcess()
    await this.prepareNextGame()
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

  private async bettingProcess(): Promise<void> {
    this.decideAiPlayersBetAmount()
    this._tableView?.createBetButtons()
    this._tableView?.getUserBetAction()
  }

  private async actingProcess(): Promise<void> {
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
    await this.aiProcess()
    await this.houseProcess()
  }

  private async evaluatingProcess(): Promise<void> {
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

  private async settlementProcess(): Promise<void> {
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

    const houseView: HouseView = this.getHouseView()

    this._tableModel.prepareNextRound()
    this.updatePlayersStatus()
    this.updatePlayersScore()
    this.resetBlackjackPlayerColor()
    houseView.updateStatus()
    houseView.updateScore()
    this.removePlayersCards()
    houseView.removeAllCards()

    await delay(BlackjackScene.DELAY_TIME * 3)

    await this.startGame()
  }

  private decideAiPlayersBetAmount(): void {
    this._tableModel.decideAiPlayersBetAmount()

    this.updatePlayersBet()
    this.updatePlayersChips()
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
        const houseView: HouseView = this.getHouseView()
        this._tableView?.addCardToHand(houseView.houseModel, houseView)
      }
    }
  }

  private revealAllHand(): void {
    this.revealUserHand()
    this.revealBotHand()
    this.revealHouseFirstHand()
  }

  private revealUserHand(): void {
    const user: PlayerView = this._playerViews.filter(
      (player: PlayerView) =>
        player.playerModel.playerType === PlayerTypes.Player
    )[0]
    user.revealHand()
  }

  private revealBotHand(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      if (playerView.playerModel.playerType === PlayerTypes.Ai)
        playerView.revealHand()
    })
  }

  private revealHouseFirstHand(): void {
    const houseView: HouseView = this.getHouseView()
    houseView.revealFirstHand()
  }

  private removePlayersCards(): void {
    this._playerViews.forEach((playerView: PlayerView) =>
      playerView.removeAllCards()
    )
  }

  private removePlayersGameResult(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      playerView.removeGameResult()
    })
  }

  private updatePlayersGameResult(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      playerView.updateGameResult()
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

  private resetBlackjackPlayerColor(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      playerView.resetBlackjackColor()
    })
  }

  private getAiPlayersView(): PlayerView[] {
    return this._playerViews.filter(
      (playerView: PlayerView) =>
        playerView.playerModel.playerType === PlayerTypes.Ai
    )
  }

  private async aiProcess(): Promise<void> {
    const aiPlayerViews: PlayerView[] = this.getAiPlayersView()

    // eslint-disable-next-line
    for (const aiPlayerView of aiPlayerViews) {
      const aiPlayerModel: BlackjackPlayer = aiPlayerView.playerModel

      // eslint-disable-next-line
      await this.drawUntilSeventeen(aiPlayerModel, aiPlayerView)
    }
  }

  private async houseProcess(): Promise<void> {
    await BlackjackScene.waitForCompletion(() => this._tableModel.isHouseTurn())
    await delay(BlackjackScene.DELAY_TIME)

    const houseView: HouseView = this.getHouseView()

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

  private getHouseView(): HouseView {
    return this._houseView[0]
  }
}
