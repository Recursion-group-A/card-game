import Card from '@/models/common/Card'
import Deck from '@/models/common/Deck'
import Player from '@/models/common/Player'
import House from '@/models/common/House'
import { GAMETYPE } from '@/types/gameTypes'
import { PLAYERTYPE } from '@/types/playerTypes'
import GAMEPHASE from '@/constants/gamePhases'

export default class Table {
  private gameType: GAMETYPE

  private playerNumber: number

  private betDenominations: number[]

  private gamePhase: string

  private deck: Deck

  private round: number

  private house: House

  private players: Player[]

  private resultLog: string[]

  constructor(gameType: GAMETYPE, playerNumber: number) {
    this.gameType = gameType
    this.playerNumber = playerNumber
    this.betDenominations = [5, 20, 50, 100]
    this.gamePhase = GAMEPHASE.BETTING
    this.deck = new Deck(this.gameType)
    this.round = 1
    this.house = new House()
    this.players = []
    this.resultLog = []

    this.initializePlayers()
    this.initializeParticipantsHand()
  }

  public initializeDeck(): void {
    this.deck.resetDeck()
  }

  public initializeRound(): void {
    this.round = 1
  }

  public initializePlayers(): void {
    this.addPlayer('Player', 'player')

    for (let i = 1; i < this.playerNumber; i += 1) {
      const computerName = `Bot_${i}`
      this.addPlayer(computerName, 'ai')
    }
  }

  public initializeParticipantsHand(): void {
    // 各々（house含む）に一枚ずつ配る行為を2巡する
    for (let i = 0; i < 2; i += 1) {
      this.players.forEach((player: Player) => {
        this.addParticipantHand(player)
      })

      this.addParticipantHand(this.house)
    }
  }

  public preparePlayersForNextRound(): void {
    this.players.forEach((player) => {
      player.prepareForNextRound()
    })
  }

  public prepareForNextRound(): void {
    this.initializeDeck()
    this.initializeRound()
    this.preparePlayersForNextRound()
  }

  public getGameType(): GAMETYPE {
    return this.gameType
  }

  public getPlayerNumber(): number {
    return this.playerNumber
  }

  public getGamePhase(): string {
    return this.gamePhase;
  }

  public getRound(): number {
    return this.round
  }

  public getResultLog(): string[] {
    return this.resultLog
  }

  public incrementRound(): void {
    this.round += 1
  }

  public changeHouseTurn(): void {
    // 一旦保存
    // drawUntilSeventeenでは「17になるまでカードを引き続ける処理」のみを行ったほうが良いかもしれません
    const houseStatus: string = this.house.drawUntilSeventeen(this.deck)
  }

  public addPlayer(playerName: string, playerType: PLAYERTYPE): void {
    this.players.push(new Player(playerName, playerType, this.gameType))
  }

  public addParticipantHand(participant: Player | House): void {
    const card: Card | undefined = this.deck.drawOne()

    if (card) {
      // addCardはPlayerとHouseの共通のメソッド
      participant.addCard(card)
    }
  }

  public setToBetting(): void {
    this.gamePhase = GAMEPHASE.BETTING
  }

  public setToActing(): void {
    this.gamePhase = GAMEPHASE.ACTING
  }

  public setToEvaluating(): void {
    this.gamePhase = GAMEPHASE.EVALUATING
  }

  public setToSettlement(): void {
    this.gamePhase = GAMEPHASE.SETTLEMENT
  }

  public setToPreparation(): void {
    this.gamePhase = GAMEPHASE.PREPARATION
  }
}
