import Pot from '@/models/poker/Pot'
import Hand from '@/models/common/Hand'
import PokerPlayer from '@/models/poker/PokerPlayer'
import Table from '@/models/common/Table'
import PokerRounds from '@/types/poker/round-types'
import PokerActions from '@/types/poker/action-types'
import PlayerTypes from '@/types/common/player-types'
import { GameTypes } from '@/types/common/game-types'

export default class PokerTable extends Table<PokerPlayer, Hand> {
  private readonly _pot: Pot

  private readonly _communityCards: Hand

  private readonly _smallBlind: number = 1

  private readonly _bigBlind: number = 2

  private readonly _limit: number = this._bigBlind

  private _dealerIndex: number

  private _sbIndex: number

  private _bbIndex: number

  private _utgIndex: number

  private _currentMaxBet: number

  private _round: PokerRounds

  private _isFirstGame: boolean

  constructor(gameType: GameTypes) {
    super(gameType, 6)

    this._players = this.generatePlayers(6)
    this._pot = new Pot()
    this._communityCards = new Hand()
    this._dealerIndex = 0
    this._sbIndex = 0
    this._bbIndex = 0
    this._utgIndex = 0
    this._currentMaxBet = this._bigBlind
    this._round = PokerRounds.PreFlop
    this._isFirstGame = true
  }

  public assignInitialDealer(): void {
    if (this.players.length <= 0) {
      return
    }
    this.dealerIndex = Math.floor(Math.random() * this.players.length)
  }

  public assignOtherPlayersPosition(): void {
    this.sbIndex = (this.dealerIndex + 1) % this.players.length
    this.bbIndex = (this.dealerIndex + 2) % this.players.length
    this.utgIndex = (this.dealerIndex + 3) % this.players.length
  }

  public collectBlind(targetIndex: number, amount: number): void {
    const player: PokerPlayer = this.players[targetIndex]
    player.placeBet(amount)
    this._pot.addPot(amount)
  }

  public handleAction(player: PokerPlayer, action: PokerActions): void {
    player.lastAction = action // eslint-disable-line

    switch (action) {
      case PokerActions.Fold:
        player.isActive = false // eslint-disable-line
        break
      case PokerActions.Call:
        {
          const amountToCall: number = this.currentMaxBet - player.bet
          player.placeBet(amountToCall)
          this.pot.addPot(amountToCall)
        }
        break
      case PokerActions.Raise:
        {
          const amountToRaise: number = this.getRaiseAmount()
          const totalBet: number = amountToRaise + player.bet
          player.placeBet(amountToRaise)
          this.pot.addPot(amountToRaise)
          this.currentMaxBet = totalBet
        }
        break
      case PokerActions.Check:
        break
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  }

  public anyoneRaisedThisRound(): boolean {
    return this.players.some(
      (player: PokerPlayer) =>
        player.isActive && player.lastAction === PokerActions.Raise
    )
  }

  public resetGame(): void {
    // プレイヤーに関する操作
    this.resetPlayersBet()
    this.resetPlayersHand()
    this.resetActiveStatus()
    this.resetPlayersLastAction()
    this.resetPlayersBestHand()

    // テーブルに関する操作
    this.deck.resetDeck()
    this.pot.resetPot()
    this.communityCards.resetHand()
    this.dealerIndex = (this.dealerIndex + 1) % this.players.length
    this.assignOtherPlayersPosition()
    this.currentMaxBet = this.bigBlind
    this.round = PokerRounds.PreFlop
  }

  // eslint-disable-next-line
  protected generatePlayers(numOfPlayers: number): PokerPlayer[] {
    const players: PokerPlayer[] = []

    for (let i: number = 0; i < numOfPlayers; i += 1) {
      const index: number = i > 2 ? i : i + 1
      if (i === 2) {
        players.push(new PokerPlayer(PlayerTypes.Player, 'you'))
      } else {
        players.push(new PokerPlayer(PlayerTypes.Ai, `bot${index}`))
      }
    }
    return players
  }

  private getRaiseAmount(): number {
    switch (this.round) {
      case PokerRounds.PreFlop:
      case PokerRounds.Flop:
        return this.limit * 2
      case PokerRounds.Turn:
      case PokerRounds.River:
        return this.limit * 4
      default:
        throw new Error(`Invalid round: ${this.round}`)
    }
  }

  private resetActiveStatus(): void {
    this.players.forEach((player: PokerPlayer) => {
      player.isActive = true // eslint-disable-line
    })
  }

  private resetPlayersHand(): void {
    this.players.forEach((player: PokerPlayer) => player.resetHand())
  }

  private resetPlayersLastAction(): void {
    this.players.forEach((player: PokerPlayer) => {
      player.lastAction = PokerActions.NoAction // eslint-disable-line
    })
  }

  private resetPlayersBestHand(): void {
    this.players.forEach((player: PokerPlayer) => {
      player.bestHand = undefined // eslint-disable-line
    })
  }

  get pot(): Pot {
    return this._pot
  }

  get communityCards(): Hand {
    return this._communityCards
  }

  get limit(): number {
    return this._limit
  }

  get dealerIndex(): number {
    return this._dealerIndex
  }

  set dealerIndex(index: number) {
    this._dealerIndex = index
  }

  get sbIndex(): number {
    return this._sbIndex
  }

  set sbIndex(index: number) {
    this._sbIndex = index
  }

  get bbIndex(): number {
    return this._bbIndex
  }

  set bbIndex(index: number) {
    this._bbIndex = index
  }

  get utgIndex(): number {
    return this._utgIndex
  }

  set utgIndex(index: number) {
    this._utgIndex = index
  }

  get smallBlind(): number {
    return this._smallBlind
  }

  get bigBlind(): number {
    return this._bigBlind
  }

  get currentMaxBet(): number {
    return this._currentMaxBet
  }

  set currentMaxBet(maxBet: number) {
    this._currentMaxBet = maxBet
  }

  get round(): PokerRounds {
    return this._round
  }

  set round(round: PokerRounds) {
    this._round = round
  }

  get isFirstTime(): boolean {
    return this._isFirstGame
  }

  set isFirstTime(bool: boolean) {
    this._isFirstGame = bool
  }
}
