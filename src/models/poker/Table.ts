import Card from '@/models/common/Card'
import Deck from '@/models/common/Deck'
import Hand from '@/models/common/Hand'
import Player from '@/models/poker/Player'
import Pot from '@/models/poker/Pot'
import PokerRound from '@/models/poker/rounds'
import PokerHand from '@/models/poker/PokerHand'
import HandEvaluator from '@/models/poker/HandEvaluator'
import { GAMETYPE } from '@/types/gameTypes'
import { RankStrategy } from '@/models/common/RankStrategy'

export default class Table {
  private readonly gameType: GAMETYPE

  private readonly players: Player[]

  private deck: Deck

  private pot: Pot

  private dealerIndex: number

  private sbIndex: number

  private bbIndex: number

  private utgIndex: number

  private readonly smallBlind: number = 25

  private readonly bigBlind: number = 50

  private currentMaxBet: number

  private communityCards: Hand

  private round: PokerRound

  private readonly limit: number = 50

  // TODO: gameTypeを受け取って rankStrategyを返す関数があってもいいかも
  constructor(gameType: GAMETYPE, rankStrategy: RankStrategy) {
    this.gameType = gameType
    this.players = Table.generatePlayers(6)
    this.deck = new Deck(this.gameType, rankStrategy)
    this.pot = new Pot()
    // すべての Index を０で初期化する
    this.dealerIndex = 0
    this.sbIndex = 0
    this.bbIndex = 0
    this.utgIndex = 0
    // すべての Index を０で初期化する
    this.currentMaxBet = this.bigBlind
    this.communityCards = new Hand()
    this.round = PokerRound.PreFlop
  }

  // ----- START ゲームの開始 -------
  public assignRandomDealerButton(): void {
    if (this.players.length === 0) {
      return
    }

    // ディーラーボタンの開始位置をランダムに決定する
    this.dealerIndex = Math.floor(Math.random() * this.players.length)
    this.players[this.dealerIndex].setAsDealer(true)

    // 他のプレイヤーの位置を更新
    this.assignPlayerPositions()
  }

  public collectBlinds(): void {
    if (this.players.length < 2) {
      return
    }

    const sbPlayer: Player = this.players[this.sbIndex]
    const bbPlayer: Player = this.players[this.bbIndex]

    this.pot.addPot(sbPlayer.placeBet(this.smallBlind))
    this.pot.addPot(bbPlayer.placeBet(this.bigBlind))
  }

  public dealCardsToPlayers(): void {
    for (let i = 0; i < 2; i += 1) {
      this.players.forEach((player: Player) => {
        player.addHand(this.drawValidCardFromDeck())
      })
    }
  }

  // ----- END ゲームの開始 -------

  // ----- ラウンドの処理 ------
  public async startRound(start: number, cardsToAdd: number): Promise<void> {
    if (cardsToAdd > 0) {
      this.dealCommunityCards(cardsToAdd)
    }

    let index: number = start
    let actionCompleted: number = 0

    while (actionCompleted < this.players.length) {
      const currentPlayer: Player = this.players[index]

      // 各プレイヤーのアクションを処理する
      if (currentPlayer.getIsActive()) {
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
    const activePlayers: Player[] = this.players.filter((p: Player) =>
      p.getIsActive()
    )
    let bestHandRank: PokerHand = PokerHand.HighCard
    let winners: Player[] = []

    activePlayers.forEach((player: Player) => {
      const playerHand: Card[] = player.getHand()
      const communityCard: Card[] = this.communityCards.getHand()

      const playerBestHand: PokerHand = HandEvaluator.evaluateHand(
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

    const potPerWinner: number = this.pot.getTotalPot() / winners.length
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
    this.pot.resetPot()
    this.communityCards.cleanHand()
    this.currentMaxBet = this.bigBlind
    this.dealerIndex = (this.dealerIndex + 1) % this.players.length
    this.assignPlayerPositions()
    this.round = PokerRound.PreFlop
  }

  private async getPlayerAction(player: Player): Promise<string> {
    if (player.getPlayerType() === 'player') {
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
  //     例）resolve(selectedAction)
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
        player.setAsActive(false)
        break
      case 'call':
        {
          const amountToCall: number = this.currentMaxBet - player.getBet()
          player.placeBet(amountToCall)
          this.pot.addPot(amountToCall)
        }
        break
      case 'raise':
        {
          const amountToRaise: number = this.getRaiseAmount()
          const totalBet: number = amountToRaise + player.getBet()
          player.placeBet(amountToRaise)
          this.currentMaxBet = totalBet
          this.pot.addPot(amountToRaise)
        }
        break
      case 'check':
        break
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  }

  public checkForWinner(): void {
    const activePlayers: Player[] = this.players.filter((p: Player) =>
      p.getIsActive()
    )

    if (activePlayers.length === 1) {
      const winner: Player = activePlayers[0]
      // TODO: ハンドが終了したときの処理
      winner.addChips(this.pot.getTotalPot())
    }

    this.resetGame()
  }

  private static generatePlayers(numOfPlayers: number): Player[] {
    const players: Player[] = []

    for (let i = 0; i < numOfPlayers; i += 1) {
      players.push(new Player())
    }

    return players
  }

  private dealCommunityCards(communityCardsToAdd: number): void {
    for (let i = 0; i < communityCardsToAdd; i += 1) {
      this.communityCards.addOne(this.drawValidCardFromDeck())
    }
  }

  // デッキからカードを得るためのヘルパー関数
  private drawValidCardFromDeck(): Card {
    const card: Card | undefined = this.deck.drawOne()

    if (!card) {
      throw new Error('At drawValidCardFromDeck: Deck is empty.')
    }
    return card
  }

  private assignPlayerPositions(): void {
    const numOfPlayers: number = this.players.length

    this.sbIndex = (this.dealerIndex + 1) % numOfPlayers
    this.bbIndex = (this.dealerIndex + 2) % numOfPlayers
    this.utgIndex = (this.dealerIndex + 3) % numOfPlayers
  }

  private getRaiseAmount(): number {
    switch (this.round) {
      case PokerRound.PreFlop:
      case PokerRound.Flop:
        return this.limit
      case PokerRound.Turn:
      case PokerRound.River:
        return this.limit * 2
      default:
        throw new Error(`Invalid round: ${this.round}`)
    }
  }

  private resetPlayersBet(): void {
    this.players.forEach((p: Player) => p.resetBet())
  }

  private resetPlayersHand(): void {
    this.players.forEach((p: Player) => p.clearHand())
  }

  private resetDealerStatus(): void {
    this.players.forEach((p: Player) => p.setAsDealer(false))
  }

  private resetActiveStatus(): void {
    this.players.forEach((p: Player) => p.setAsActive(true))
  }
}
