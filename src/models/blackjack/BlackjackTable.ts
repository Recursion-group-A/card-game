import House from '@/models/blackjack/House'
import BlackjackPlayer from '@/models/blackjack/BlackjackPlayer'
import Table from '@/models/common/Table'
import { ParticipantStatuses } from '@/types/blackjack/participant-status-types'
import BlackjackHand from '@/models/blackjack/BlackjackHand'
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

  public setPlayersStatus(): void {
    this.players.forEach((player) => {
      if (player.isBlackjack()) {
        player.blackjack()
      } else if (player.canStandAi()) {
        player.stand()
      }
    })
  }

  public setHouseStatus(): void {
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
    const houseStatus: ParticipantStatuses = this._house.status
    const houseScore: number = this._house.getHandTotalScore()

    this.players.forEach((player) => {
      player.evaluating(houseStatus, houseScore)
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
