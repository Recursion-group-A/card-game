import Card from '@/models/common/Card'
import Deck from '@/models/common/Deck'
import Hand from '@/models/common/Hand'
import Pot from '@/models/poker/Pot'
import Player from '@/models/poker/Player'
import { GAMETYPE } from '@/types/gameTypes'
import PokerRound from '@/models/poker/rounds'
import PLAYERTYPES from '@/types/playerTypes'
import PokerAction from '@/models/poker/PokerAction'

export default class Table {
  private readonly _gameType: GAMETYPE

  private readonly _players: Player[]

  private readonly _deck: Deck

  private readonly _pot: Pot

  private _dealerIndex: number

  private _sbIndex: number

  private _bbIndex: number

  private _utgIndex: number

  private readonly _smallBlind: number = 1

  private readonly _bigBlind: number = 2

  private _currentMaxBet: number

  private readonly _communityCards: Hand

  private _round: PokerRound

  private readonly _limit: number = this._bigBlind

  constructor(gameType: GAMETYPE) {
    this._gameType = gameType
    this._players = Table.generatePlayers(6)
    this._deck = new Deck(this.gameType)
    this._pot = new Pot()
    this._dealerIndex = 0
    this._sbIndex = 0
    this._bbIndex = 0
    this._utgIndex = 0
    this._currentMaxBet = this._bigBlind
    this._communityCards = new Hand()
    this._round = PokerRound.PreFlop

    this._deck.shuffle()
  }

  get gameType(): GAMETYPE {
    return this._gameType
  }

  get players(): Player[] {
    return this._players
  }

  get deck(): Deck {
    return this._deck
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

  get communityCards(): Hand {
    return this._communityCards
  }

  get pot(): Pot {
    return this._pot
  }

  set round(roundName: PokerRound) {
    this._round = roundName
  }

  private static generatePlayers(numOfPlayers: number): Player[] {
    const players: Player[] = []

    for (let i: number = 0; i < numOfPlayers; i += 1) {
      const index: number = i > 2 ? i : i + 1
      if (i === 2) {
        players.push(new Player('you', PLAYERTYPES.PLAYER))
      } else {
        players.push(new Player(`bot${index}`, PLAYERTYPES.AI))
      }
    }
    return players
  }

  public assignInitialDealer(): void {
    if (this._players.length < 0) {
      return
    }

    this._dealerIndex = Math.floor(Math.random() * this._players.length)
    this._players[this._dealerIndex].isDealer = true
  }

  public collectBlind(targetIndex: number, amount: number): void {
    if (this._players.length < 2) {
      return
    }

    const player: Player = this._players[targetIndex]
    this._pot.addPot(player.placeBet(amount))
  }

  public dealCardsToPlayers(): void {
    for (let i = 0; i < 2; i += 1) {
      this.players.forEach((player: Player) => {
        const card: Card = this.drawValidCardFromDeck()
        player.addHand(card)
      })
    }
  }

  public resetGame(): void {
    // プレイヤーに関する操作
    this.resetPlayersHand()
    this.resetPlayersBet()
    this.resetActiveStatus()
    this.resetDealerStatus()

    // テーブルに関する操作
    this.deck.resetDeck()
    this._pot.resetPot()
    this._communityCards.cleanHand()
    this._currentMaxBet = this._bigBlind
    this._dealerIndex = (this._dealerIndex + 1) % this.players.length
    this.assignOtherPlayersPosition()
    this._round = PokerRound.PreFlop
  }

  // eslint-disable-next-line
  public determineAIAction(player: Player): PokerAction {
    if (this._currentMaxBet - player.bet > 0) {
      return PokerAction.CALL
    }
    return PokerAction.CHECK
  }

  public handleAction(player: Player, action: PokerAction): void {
    // eslint-disable-next-line
    player.lastAction = action

    switch (action) {
      case 'fold':
        player.isActive = false // eslint-disable-line
        break
      case 'call':
        {
          const amountToCall: number = this._currentMaxBet - player.bet
          player.placeBet(amountToCall)
          this._pot.addPot(amountToCall)
        }
        break
      case 'raise':
        {
          const amountToRaise: number = this.getRaiseAmount()
          const totalBet: number = amountToRaise + player.bet
          player.placeBet(amountToRaise)
          this._currentMaxBet = totalBet
          this._pot.addPot(amountToRaise)
        }
        break
      case 'check':
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

  // デッキからカードを得るためのヘルパー関数
  public drawValidCardFromDeck(): Card {
    const card: Card | undefined = this.deck.drawOne()

    if (!card) {
      throw new Error('At drawValidCardFromDeck: Deck is empty.')
    }
    return card
  }

  public assignOtherPlayersPosition(): void {
    const numOfPlayers: number = this.players.length

    this._sbIndex = (this._dealerIndex + 1) % numOfPlayers
    this._bbIndex = (this._dealerIndex + 2) % numOfPlayers
    this._utgIndex = (this._dealerIndex + 3) % numOfPlayers
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

  private resetPlayersBet(): void {
    this.players.forEach((p: Player) => p.resetBet())
  }

  private resetPlayersHand(): void {
    this.players.forEach((p: Player) => p.clearHand())
  }

  private resetDealerStatus(): void {
    // eslint-disable-next-line
    for (const p of this.players) {
      p.isDealer = false
    }
  }

  private resetActiveStatus(): void {
    // eslint-disable-next-line
    for (const p of this.players) {
      p.isActive = true
    }
  }
}
