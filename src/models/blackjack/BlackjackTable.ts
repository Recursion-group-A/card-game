import Card from '@/models/common/Card'
import House from '@/models/blackjack/House'
import BlackjackPlayer from '@/models/blackjack/BlackjackPlayer'
import Table from '@/models/common/Table'
import BlackjackHand from '@/models/blackjack/BlackjackHand'
import PlayerTypes from '@/types/common/player-types'
import { GamePhases } from '@/types/common/game-phase-types'
import { GameTypes } from '@/types/common/game-types'

export default class BlackjackTable extends Table<
  BlackjackPlayer,
  BlackjackHand
> {
  private readonly _house: House

  private _gamePhase: GamePhases

  private _round: number

  constructor(gameType: GameTypes) {
    super(gameType, 6)

    this._players = this.generatePlayers(6)
    this._house = new House()
    this._gamePhase = GamePhases.Betting
    this._round = 1
  }

  public prepareForNextRound(): void {
    this.gamePhase = GamePhases.Preparation
    this.deck.resetDeck()
    this.incrementRound()
    // this.preparePlayersForNextRound()
    this.prepareHouseForNextRound()
    this.initializeParticipantsHand()
    this.decideAiPlayersBetAmount()
    this.gamePhase = GamePhases.Betting
  }

  public incrementRound(): void {
    this._round += 1
  }

  public changeHouseTurn(): void {
    this._house.drawUntilSeventeen(this.deck)
  }

  public changeAiPlayerTurn(): void {
    const aiPlayers: BlackjackPlayer[] = this.players.slice(1)

    aiPlayers.forEach((aiPlayer) => {
      aiPlayer.drawUntilSeventeen(this.deck)
    })
  }

  public addPlayer(playerName: string, playerType: PlayerTypes): void {
    this.players.push(new BlackjackPlayer(playerType, playerName))
  }

  public addParticipantHand(participant: BlackjackPlayer): void {
    const card: Card | undefined = this.deck.drawOne()

    if (card) {
      // addCardはPlayerとHouseの共通のメソッド
      participant.addHand(card)
    }
  }

  public addPlayerBet(amount: number) {
    const player: BlackjackPlayer = this.players[0]
    if (player.canBet(amount)) {
      player.addBet(amount)
    }
  }

  public decideAiPlayersBetAmount(): void {
    const aiPlayers: BlackjackPlayer[] = this.players.slice(1)

    aiPlayers.forEach((aiPlayer) => {
      aiPlayer.decideAiPlayerBetAmount()
    })
  }

  public settlementPlayers(): void {
    const houseScore: number = this._house.getHandTotalScore()
    this.players.forEach((player) => {
      player.settlement(houseScore)
    })
  }

  public startGame(): void {
    this.gamePhase = GamePhases.Acting
    // this.initializePlayers()
    this.initializeParticipantsHand()
    this.decideAiPlayersBetAmount()
  }

  public commonProcess(player: BlackjackPlayer): void {
    this.addParticipantHand(player)
    player.incrementCurrentTurn()
    if (player.isBust()) player.bust()
  }

  public standProcess(): void {
    const player: BlackjackPlayer = this.players[0]
    player.stand()
  }

  public hitProcess(): void {
    const player: BlackjackPlayer = this.players[0]

    if (player.canHit()) {
      this.commonProcess(player)
    }
  }

  public doubleProcess(): void {
    const player: BlackjackPlayer = this.players[0]

    if (player.canDouble()) {
      player.double()
      this.commonProcess(player)
    }
  }

  public surrenderProcess(): void {
    const player: BlackjackPlayer = this.players[0]

    if (player.canSurrender()) {
      player.surrender()
      this.commonProcess(player)
    }
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

  private initializeParticipantsHand(): void {
    for (let i = 0; i < 2; i += 1) {
      this.players.forEach((player: BlackjackPlayer) => {
        this.addParticipantHand(player)
      })
      // this.addParticipantHand(this._house)
    }
  }

  private prepareHouseForNextRound(): void {
    this._house.prepareForNextRound()
  }

  get gamePhase(): GamePhases {
    return this._gamePhase
  }

  set gamePhase(gamePhase: GamePhases) {
    this._gamePhase = gamePhase
  }

  get round(): number {
    return this._round
  }

  set round(round: number) {
    this._round = round
  }
}
