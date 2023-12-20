import Card from '@/models/common/Card'
import Deck from '@/models/common/Deck'
import Hand from '@/models/common/Hand'
import Pot from '@/models/poker/Pot'
import Player from '@/models/poker/Player'
import PokerRound from '@/models/poker/rounds'
import PLAYERTYPES from '@/types/playerTypes'
import PokerAction from '@/models/poker/PokerAction'
import { GAMETYPE } from '@/types/gameTypes'

export default class Table {
  private readonly _players: Player[]

  private readonly _deck: Deck

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

  private _round: PokerRound

  private _isFirstGame: boolean

  constructor(gameType: GAMETYPE) {
    this._players = Table.generatePlayers(6)
    this._deck = new Deck(gameType)
    this._pot = new Pot()
    this._communityCards = new Hand()
    this._dealerIndex = 0
    this._sbIndex = 0
    this._bbIndex = 0
    this._utgIndex = 0
    this._currentMaxBet = this._bigBlind
    this._round = PokerRound.PreFlop
    this._isFirstGame = true

    this._deck.shuffle()
  }

  get players(): Player[] {
    return this._players
  }

  get deck(): Deck {
    return this._deck
  }

  get pot(): Pot {
    return this._pot
  }

  get communityCards(): Hand {
    return this._communityCards
  }

  get dealerIndex(): number {
    return this._dealerIndex
  }

  get sbIndex(): number {
    return this._sbIndex
  }

  get bbIndex(): number {
    return this._bbIndex
  }

  get utgIndex(): number {
    return this._utgIndex
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

  get round(): PokerRound {
    return this._round
  }

  set round(round: PokerRound) {
    this._round = round
  }

  get isFirstTime(): boolean {
    return this._isFirstGame
  }

  set isFirstTime(bool: boolean) {
    this._isFirstGame = bool
  }

  private static generatePlayers(numOfPlayers: number): Player[] {
    const players: Player[] = []

    for (let i: number = 0; i < numOfPlayers; i += 1) {
      const index: number = i > 2 ? i : i + 1
      if (i === 2) {
        players.push(new Player(PLAYERTYPES.PLAYER, 'you'))
      } else {
        players.push(new Player(PLAYERTYPES.AI, `bot${index}`))
      }
    }
    return players
  }

  public assignInitialDealer(): void {
    if (this._players.length < 0) {
      return
    }

    this._dealerIndex = Math.floor(Math.random() * this._players.length)
  }

  public collectBlind(targetIndex: number, amount: number): void {
    const player: Player = this._players[targetIndex]
    player.placeBet(amount)
    this._pot.addPot(amount)
  }

  public dealCardsToPlayers(): void {
    for (let i: number = 0; i < 2; i += 1) {
      this._players.forEach((player: Player) => {
        player.addHand(this.drawValidCardFromDeck())
      })
    }
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
    this._pot.resetPot()
    this._communityCards.cleanHand()
    this._dealerIndex = (this._dealerIndex + 1) % this.players.length
    this.assignOtherPlayersPosition()
    this._currentMaxBet = this._bigBlind
    this._round = PokerRound.PreFlop
  }

  public handleAction(player: Player, action: PokerAction): void {
    // eslint-disable-next-line
    player.lastAction = action

    switch (action) {
      case PokerAction.FOLD:
        player.isActive = false // eslint-disable-line
        break
      case PokerAction.CALL:
        {
          const amountToCall: number = this._currentMaxBet - player.bet
          player.placeBet(amountToCall)
          this._pot.addPot(amountToCall)
        }
        break
      case PokerAction.RAISE:
        {
          const amountToRaise: number = this.getRaiseAmount()
          const totalBet: number = amountToRaise + player.bet
          player.placeBet(amountToRaise)
          this._currentMaxBet = totalBet
          this._pot.addPot(amountToRaise)
        }
        break
      case PokerAction.CHECK:
        break
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  }

  public checkForWinner(): void {
    const activePlayers: Player[] = this.players.filter(
      (p: Player) => p.isActive
    )

    if (activePlayers.length === 1) {
      const winner: Player = activePlayers[0]
      winner.addChips(this._pot.getTotalPot())
    }

    this.resetGame()
  }

  public drawValidCardFromDeck(): Card {
    const card: Card | undefined = this.deck.drawOne()
    if (!card) {
      throw new Error('At drawValidCardFromDeck: Deck is empty.')
    }
    return card
  }

  public assignOtherPlayersPosition(): void {
    this._sbIndex = (this._dealerIndex + 1) % this.players.length
    this._bbIndex = (this._dealerIndex + 2) % this.players.length
    this._utgIndex = (this._dealerIndex + 3) % this.players.length
  }

  private getRaiseAmount(): number {
    switch (this._round) {
      case PokerRound.PreFlop:
      case PokerRound.Flop:
        return this._limit * 2
      case PokerRound.Turn:
      case PokerRound.River:
        return this._limit * 4
      default:
        throw new Error(`Invalid round: ${this._round}`)
    }
  }

  public anyoneRaisedThisRound(): boolean {
    return this._players.some(
      (player: Player) =>
        player.isActive && player.lastAction === PokerAction.RAISE
    )
  }

  private resetPlayersBet(): void {
    this._players.forEach((p: Player) => p.resetBet())
  }

  private resetPlayersHand(): void {
    this._players.forEach((p: Player) => p.clearHand())
  }

  private resetActiveStatus(): void {
    this._players.forEach((p: Player) => {
      p.isActive = true // eslint-disable-line
    })
  }

  private resetPlayersLastAction(): void {
    this._players.forEach((p: Player) => {
      p.lastAction = PokerAction.NO_ACTION // eslint-disable-line
    })
  }

  private resetPlayersBestHand(): void {
    this._players.forEach((p: Player) => {
      p.bestHand = undefined // eslint-disable-line
    })
  }
}
