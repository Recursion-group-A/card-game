import BlackjackPlayer from '@/models/blackjack/BlackjackPlayer'
import House from '@/models/blackjack/House'
import BlackjackHand from '@/models/blackjack/BlackjackHand'
import Table from '@/models/common/Table'
import PlayerTypes from '@/types/common/player-types'
import { GamePhases } from '@/types/common/game-phase-types'
import { GameTypes } from '@/types/common/game-types'

export default class BlackjackTable extends Table<
  BlackjackPlayer,
  BlackjackHand
> {
  private readonly _house: House

  private readonly _betDenominations: number[]

  private _userBetCompleted: boolean

  private _evaluateCompleted: boolean

  private _settlementCompleted: boolean

  private _gamePhase: GamePhases

  constructor(gameType: GameTypes) {
    super(gameType, 5)

    this._players = this.generatePlayers(5)
    this._house = new House()
    this._betDenominations = [5, 20, 50, 100]
    this._gamePhase = GamePhases.Betting
    this._userBetCompleted = false
    this._evaluateCompleted = false
    this._settlementCompleted = false
  }

  private preparePlayersNextRound(): void {
    this.players.forEach((player: BlackjackPlayer) => player.prepareNextRound())
  }

  private prepareHouseForNextRound(): void {
    this._house.prepareNextRound()
  }

  public prepareNextRound(): void {
    this.preparePlayersNextRound()
    this.prepareHouseForNextRound()

    this._deck.resetDeck()
    this._userBetCompleted = false
    this._evaluateCompleted = false
    this._settlementCompleted = false
    this.gamePhase = GamePhases.Betting
  }

  public initializeParticipantsStatus(): void {
    this.players.forEach((player) => {
      if (player.isBlackjack()) {
        player.blackjack()
      } else if (player.canStandAi()) {
        player.stand()
      }
    })

    if (this._house.isBlackjack()) {
      this._house.blackjack()
    } else if (this._house.isHandTotalScoreAbove17()) {
      this._house.stand()
    }
  }

  public isHouseTurn(): boolean {
    const allPlayerActionCompleted: boolean = this.players.every(
      (player) => player.actionCompleted === true
    )

    return allPlayerActionCompleted
  }

  public houseActionCompleted(): boolean {
    return this._house.actionCompleted
  }

  public evaluatingPlayers(): void {
    this.players.forEach((player) => {
      player.evaluating(this._house.status, this._house.getHandTotalScore())
    })

    this._evaluateCompleted = true
  }

  public settlementPlayers(): void {
    this.players.forEach((player) => {
      player.settlement()
    })

    this._settlementCompleted = true
  }

  public decideAiPlayersBetAmount(): void {
    this.players.forEach((player: BlackjackPlayer) => {
      if (player.playerType === PlayerTypes.Ai) player.decideAiPlayerBetAmount()
    })
  }

  // eslint-disable-next-line
  protected generatePlayers(numOfPlayers: number): BlackjackPlayer[] {
    const players: BlackjackPlayer[] = []

    for (let i: number = 0; i < numOfPlayers; i += 1) {
      const index: number = i > 2 ? i : i + 1
      if (i === 2) {
        players.push(new BlackjackPlayer(PlayerTypes.Player, 'you'))
      } else {
        players.push(new BlackjackPlayer(PlayerTypes.Ai, `bot${index}`))
      }
    }
    return players
  }

  public setActingPhase(): void {
    this._gamePhase = GamePhases.Acting
  }

  public setEvaluatingPhase(): void {
    this._gamePhase = GamePhases.Evaluating
  }

  public setSettlementPhase(): void {
    this._gamePhase = GamePhases.Settlement
  }

  public setPreparationPhase(): void {
    this._gamePhase = GamePhases.Preparation
  }

  get betDenominations(): number[] {
    return this._betDenominations
  }

  get house(): House {
    return this._house
  }

  get gamePhase(): GamePhases {
    return this._gamePhase
  }

  set gamePhase(gamePhase: GamePhases) {
    this._gamePhase = gamePhase
  }

  get userBetCompleted(): boolean {
    return this._userBetCompleted
  }

  set userBetCompleted(bool: boolean) {
    this._userBetCompleted = bool
  }

  get evaluateCompleted(): boolean {
    return this._evaluateCompleted
  }

  get settlementCompleted(): boolean {
    return this._settlementCompleted
  }
}
