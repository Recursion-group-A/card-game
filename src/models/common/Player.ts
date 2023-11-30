import Card from '@/models/common/Card'
import Hand from '@/models/common/Hand'
import Deck from '@/models/common/Deck'
import { PLAYER_STATES } from '@/constants/playerStates'
import { PLAYERTYPE } from '@/types/playerTypes'
import { GAMETYPE } from '@/types/gameTypes'

export default class Player {
  private playerName: string

  private playerType: PLAYERTYPE

  private gameType: GAMETYPE

  private chips: number

  private bet: number

  private winAmount: number

  private currentTurn: number

  private hand: Hand

  private states: string

  constructor(
    playerName: string,
    playerType: PLAYERTYPE,
    gameType: GAMETYPE,
    chips: number = 1000
  ) {
    this.playerName = playerName
    this.playerType = playerType
    this.gameType = gameType
    this.chips = chips
    this.bet = 0
    this.winAmount = 0
    this.currentTurn = 1
    this.hand = new Hand()
    this.states = PLAYER_STATES.WAIT
  }

  public initializeChips(): void {
    this.chips = 1000
  }

  public initializeBet(): void {
    this.bet = 0
  }

  public initializeWinAmount(): void {
    this.winAmount = 0
  }

  public initializeCurrentTurn(): void {
    this.currentTurn = 1
  }

  public initializeHand(): void {
    this.hand.cleanHand()
  }

  public initializeStates(): void {
    this.states = PLAYER_STATES.WAIT
  }

  public prepareForNextRound(): void {
    this.initializeBet()
    this.initializeCurrentTurn()
    this.initializeHand()
    this.initializeStates()
  }

  public getPlayerName(): string {
    return this.playerName
  }

  public getPlayerType(): PLAYERTYPE {
    return this.playerType
  }

  public getChips(): number {
    return this.chips
  }

  public getBet(): number {
    return this.bet
  }

  public getWinAmount(): number {
    return this.winAmount
  }

  public getCurrentTurn(): number {
    return this.currentTurn
  }

  public getHand(): Card[] {
    return this.hand.getHand()
  }

  public getStates(): string {
    return this.states
  }

  public getHandTotalScore(): number {
    return this.hand.getHandTotalScore()
  }

  public addCard(card: Card): void {
    this.hand.addOne(card)
  }

  public addChips(amount: number): void {
    this.chips += amount
  }

  public addBet(amount: number): void {
    this.bet += amount
  }

  public incrementCurrentTurn(): void {
    this.currentTurn += 1
  }

  public removeBet(amount: number): void {
    this.bet -= amount
  }

  public removeChips(amount: number): void {
    this.chips -= amount
  }

  public changeBet(amount: number): void {
    this.bet = amount
  }

  public changeStates(states: string): void {
    this.states = states
  }

  public setToBroken(): void {
    this.changeStates(PLAYER_STATES.BROKEN)
  }

  public setToStand(): void {
    this.changeStates(PLAYER_STATES.STAND)
  }

  public setToDouble(): void {
    this.changeStates(PLAYER_STATES.DOUBLE_DOWN)
  }

  public setToSurrender(): void {
    this.changeStates(PLAYER_STATES.SURRENDER)
  }

  public setToBust(): void {
    this.changeStates(PLAYER_STATES.BUST)
  }

  public setToBlackjack(): void {
    this.changeStates(PLAYER_STATES.BLACKJACK)
  }

  public isFirstTurn(): boolean {
    return this.currentTurn === 1
  }

  public isBlackjack(): boolean {
    return this.hand.isBlackjack()
  }

  public isBroken(): boolean {
    return this.chips <= 0
  }

  public isBust(): boolean {
    return this.hand.isBust()
  }

  public isPlayerScoreSame(houseScore: number) {
    return houseScore === this.getHandTotalScore()
  }

  public isPlayerScoreHigh(houseScore: number) {
    return houseScore < this.getHandTotalScore()
  }

  public canBet(bet: number): boolean {
    return this.bet + bet <= this.chips
  }

  public canHit(): boolean {
    return this.hand.canHit()
  }

  public canDouble(): boolean {
    if (this.isBlackjack()) return false

    const doubleBet: number = this.getBet() * 2
    const currentChips: number = this.getChips()

    return this.isFirstTurn() && doubleBet <= currentChips
  }

  public canSurrender(): boolean {
    if (this.isBlackjack()) return false

    const halfBet: number = Math.floor(this.getBet() / 2)

    return this.isFirstTurn() && halfBet > 0
  }

  public broken(): void {
    this.setToBroken()
  }

  public bust(): void {
    this.setToBust()
  }

  public stand(): void {
    this.setToStand()
  }

  public double(): void {
    this.removeChips(this.bet)
    this.addBet(this.bet)
    this.setToDouble()
  }

  public surrender(): void {
    const currentBet: number = this.bet

    this.removeBet(Math.floor(currentBet / 2))
    this.addChips(Math.floor(currentBet / 2))
    this.setToSurrender()
  }

  public settlement(houseScore: number) {
    if(this.isPlayerScoreSame(houseScore)) this.addChips(this.bet)
    else if(this.isPlayerScoreHigh(houseScore)) this.addChips(this.bet*2)
  }

  public decideAiPlayerBetAmount(): void {
    const max: number = Math.floor(this.chips * 0.2)
    const min: number = Math.floor(this.chips * 0.1)
    const betAmount: number = Math.floor(Math.random() * (max - min) + min)

    this.bet = betAmount
  }

  public drawUntilSeventeen(deck: Deck): void {
    while (this.getHandTotalScore() < 17) {
      const card: Card | undefined = deck.drawOne()

      if (!card) {
        throw new Error('Deck is empty.')
      }

      this.addCard(card)
      this.incrementCurrentTurn()

      if(this.getHandTotalScore() > 21) {
        this.setToBust()
        break
      } else if(this.getHandTotalScore() >= 17) {
        this.setToStand()
        break
      }
    }
  }
}