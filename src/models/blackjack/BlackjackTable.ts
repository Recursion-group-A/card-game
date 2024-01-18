import House from '@/models/blackjack/House'
import BlackjackPlayer from '@/models/blackjack/BlackjackPlayer'
import Table from '@/models/common/Table'
import BlackjackHand from '@/models/blackjack/BlackjackHand'
import PlayerTypes from '@/types/common/player-types'
import { GamePhases } from '@/types/common/game-phase-types'
import { GameTypes } from '@/types/common/game-types'
import HouseStatus from '@/types/blackjack/house-status-types'

export default class BlackjackTable extends Table<
  BlackjackPlayer,
  BlackjackHand
> {
  private readonly _house: House

  private readonly _betDenominations: number[]

  private _userBetCompleted: boolean

  private _gamePhase: GamePhases

  constructor(gameType: GameTypes) {
    super(gameType, 5)

    this._players = this.generatePlayers(5)
    this._house = new House()
    this._gamePhase = GamePhases.Betting
    this._userBetCompleted = false
  }

  public setPlayersStatus(): void {
    this.players.forEach((player) => {
      if (player.isBlackjack()) {
        player.blackjack()
      } else if (
        player.playerType === PLAYERTYPE.Ai &&
        player.getHandTotalScore() >= 17
      ) {
        player.stand()
      }
    })
  }

  public setHouseStatus(): void {
    if (this._house.isBlackjack()) {
      this._house.blackjack()
    } else if (this._house.getHandTotalScore() >= 17) {
      this._house.stand()
    }
  }

  public initializeDeck(): void {
    this.deck.resetDeck()
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

  public prepareHouseForNextRound(): void {
    this._house.prepareForNextRound()
  }

  public prepareForNextRound(): void {
    this.gamePhase = GamePhases.Preparation
    this.initializeDeck()
    this.prepareHouseForNextRound()
    this.gamePhase = GamePhases.Betting
  }

  public evaluatingPlayers(): void {
    const houseScore: number = this._house.getHandTotalScore()
    const houseStatus: HouseStatus = this._house.status

    this.players.forEach((player) => {
      player.evaluating(houseScore, houseStatus)
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
}
