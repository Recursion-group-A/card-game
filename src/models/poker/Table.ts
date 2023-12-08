import Card from '@/models/common/Card'
import Deck from '@/models/common/Deck'
import Hand from '@/models/common/Hand'
import Pot from '@/models/poker/Pot'
import Player from '@/models/poker/Player'
import PokerHand from '@/models/poker/PokerHand'
import { GAMETYPE } from '@/types/gameTypes'
import PokerRound from '@/models/poker/rounds'
import PokerHandEvaluator from '@/models/poker/PokerHandEvaluator'
import PLAYERTYPES from '@/types/playerTypes'

export default class Table {
  private readonly _gameType: GAMETYPE

  private readonly _players: Player[]

  private readonly _deck: Deck

  private readonly _pot: Pot

  private _dealerIndex: number

  private _sbIndex: number

  private _bbIndex: number

  private _utgIndex: number

  private readonly _smallBlind: number = 25

  private readonly _bigBlind: number = 50

  private _currentMaxBet: number

  private _communityCards: Hand

  private _round: PokerRound

  private readonly _limit: number = 50

  constructor(gameType: GAMETYPE) {
    this._gameType = gameType
    this._players = Table.generatePlayers(6)
    this._deck = new Deck(this.gameType)
    this._pot = new Pot()
    // すべての Index を０で初期化する
    this._dealerIndex = 0
    this._sbIndex = 0
    this._bbIndex = 0
    this._utgIndex = 0
    // すべての Index を０で初期化する
    this._currentMaxBet = this._bigBlind
    this._communityCards = new Hand()
    this._round = PokerRound.PreFlop
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

  private static generatePlayers(numOfPlayers: number): Player[] {
    const players: Player[] = []

    for (let i = 0; i < numOfPlayers; i += 1) {
      const index: number = i > 2 ? i : i + 1
      if (i === 2) {
        players.push(new Player('you', PLAYERTYPES.PLAYER))
      } else {
        players.push(new Player(`bot${index}`, PLAYERTYPES.AI))
      }
    }

    return players
  }

  public assignRandomDealerButton(): void {
    if (this.players.length === 0) {
      return
    }
    // ディーラーボタンの開始位置をランダムに決定する
    this._dealerIndex = Math.floor(Math.random() * this.players.length)
    this.players[this._dealerIndex].isDealer = true

    this.assignOtherPlayersPosition()
  }

  public collectBlinds(): void {
    if (this.players.length < 2) {
      return
    }

    const sbPlayer: Player = this.players[this._sbIndex]
    const bbPlayer: Player = this.players[this._bbIndex]

    this._pot.addPot(sbPlayer.placeBet(this._smallBlind))
    this._pot.addPot(bbPlayer.placeBet(this._bigBlind))
  }

  public dealCardsToPlayers(): void {
    for (let i = 0; i < 2; i += 1) {
      this.players.forEach((player: Player) => {
        const card: Card = this.drawValidCardFromDeck()
        player.addHand(card)
      })
    }
  }

  public async startRound(start: number, cardsToAdd: number): Promise<void> {
    if (cardsToAdd > 0) {
      this.dealCommunityCards(cardsToAdd)
    }

    let index: number = start
    let actionCompleted: number = 0

    while (actionCompleted < this.players.length) {
      const currentPlayer: Player = this.players[index]

      // 各プレイヤーのアクションを処理する
      if (currentPlayer.isActive) {
        const action = await this.getPlayerAction(currentPlayer) // eslint-disable-line
        this.handleAction(currentPlayer, action)

        if (action === 'raise') {
          actionCompleted = 0
        }
      }
      index = (index + 1) % this.players.length
      actionCompleted += 1
    }
  }

  public showDown(): void {
    const activePlayers: Player[] = this.players.filter(
      (player: Player) => player.isActive
    )
    let bestHandRank: PokerHand = PokerHand.HighCard
    let winners: Player[] = []

    activePlayers.forEach((player: Player) => {
      const playerHand: Card[] = player.hand
      const communityCard: Card[] = this._communityCards.getHand()

      const playerBestHand: PokerHand = PokerHandEvaluator.evaluateHand(
        playerHand,
        communityCard
      )

      if (playerBestHand > bestHandRank) {
        bestHandRank = playerBestHand
        winners = [player]
      } else if (playerBestHand === bestHandRank) {
        winners.push(player)
      }
    })

    const potPerWinner: number = this._pot.getTotalPot() / winners.length
    winners.forEach((winner: Player) => {
      winner.addChips(potPerWinner)
    })

    this.resetGame()
  }

  private resetGame(): void {
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

  private async getPlayerAction(player: Player): Promise<string> {
    if (player.playerType === 'player') {
      // const userInput = await this.getUserInput()
      const userInput = '未実装'
      return userInput
    }
    // AIのアクションを決定する
    return this.determineAIAction()
  }

  // eslint-disable-next-line
  // private getUserInput(): Promise<string> {
  //   // TODO: View との連携
  //   return new Promise<string>((resolve) => {
  //     // 例）resolve(selectedAction)
  //   })
  // }

  // eslint-disable-next-line
  private determineAIAction(): string {
    // TODO: AIのアクションを決定するロジック
    const actions = ['call', 'raise', 'fold']
    return actions[Math.floor(Math.random() * actions.length)]
  }

  private handleAction(player: Player, action: string): void {
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
      // TODO: ハンドが終了したときの処理
      winner.addChips(this._pot.getTotalPot())
    }

    this.resetGame()
  }

  private dealCommunityCards(communityCardsToAdd: number): void {
    for (let i = 0; i < communityCardsToAdd; i += 1) {
      this._communityCards.addOne(this.drawValidCardFromDeck())
    }
  }

  // デッキからカードを得るためのヘルパー関数
  public drawValidCardFromDeck(): Card {
    const card: Card | undefined = this.deck.drawOne()

    if (!card) {
      throw new Error('At drawValidCardFromDeck: Deck is empty.')
    }
    return card
  }

  private assignOtherPlayersPosition(): void {
    const numOfPlayers: number = this.players.length

    this._sbIndex = (this._dealerIndex + 1) % numOfPlayers
    this._bbIndex = (this._dealerIndex + 2) % numOfPlayers
    this._utgIndex = (this._dealerIndex + 3) % numOfPlayers
  }

  private getRaiseAmount(): number {
    switch (this._round) {
      case PokerRound.PreFlop:
      case PokerRound.Flop:
        return this._limit
      case PokerRound.Turn:
      case PokerRound.River:
        return this._limit * 2
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
