import Card from '@/models/common/Card'
import House from '@/models/blackjack/House'
import BlackjackPlayer from '@/models/blackjack/BlackjackPlayer'
import Table from '@/models/common/Table'
import BlackjackHand from '@/models/blackjack/BlackjackHand'
import PLAYERTYPE from '@/types/common/playerTypes'
import { GAMEPHASE } from '@/types/common/gamePhases'
import { GAMETYPE } from '@/types/common/gameTypes'

export default class BlackjackTable extends Table<
  BlackjackPlayer,
  BlackjackHand
> {
  private readonly _house: House

  private readonly _betDenominations: number[]

  private _gamePhase: GAMEPHASE

  private _round: number

  constructor(gameType: GAMETYPE) {
    super(gameType, 6)

    this._players = this.generatePlayers(6)
    this._house = new House()
    this._betDenominations = [5, 20, 50, 100]
    this._gamePhase = GAMEPHASE.Betting
    this._round = 1
  }

  public initializeDeck(): void {
    this.deck.resetDeck()
  }

  public initializeParticipantsHand(): void {
    // 各々（house含む）に一枚ずつ配る行為を2巡する
    for (let i = 0; i < 2; i += 1) {
      this.players.forEach((player: BlackjackPlayer) => {
        this.addParticipantHand(player)
      })

      // this.addParticipantHand(this._house)
    }
  }

  // public preparePlayersForNextRound(): void {
  //   this.players.forEach((player: BlackjackPlayer) => {
  //     // player.prepareForNextRound()
  //   })
  // }

  public prepareHouseForNextRound(): void {
    this._house.prepareForNextRound()
  }

  public prepareForNextRound(): void {
    this.gamePhase = GAMEPHASE.Preparation
    this.initializeDeck()
    this.incrementRound()
    // this.preparePlayersForNextRound()
    this.prepareHouseForNextRound()
    this.initializeParticipantsHand()
    this.decideAiPlayersBetAmount()
    this.gamePhase = GAMEPHASE.Betting
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

  public addPlayer(playerName: string, playerType: PLAYERTYPE): void {
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
    this.gamePhase = GAMEPHASE.Acting
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
        players.push(new BlackjackPlayer(PLAYERTYPE.PLAYER, 'you'))
      } else {
        players.push(new BlackjackPlayer(PLAYERTYPE.AI, `bot${index}`))
      }
    }
    return players
  }

  get gamePhase(): GAMEPHASE {
    return this._gamePhase
  }

  set gamePhase(gamePhase: GAMEPHASE) {
    this._gamePhase = gamePhase
  }

  get round(): number {
    return this._round
  }

  set round(round: number) {
    this._round = round
  }
}
