import Hand from '@/models/common/Hand'
import Table from '@/models/common/Table'
import WarPlayer from '@/models/war/WarPlayer'
import PlayerTypes from '@/types/common/player-types'
import { GameTypes } from '@/types/common/game-types'

export default class WarTable extends Table<WarPlayer, Hand> {
  constructor(gameType: GameTypes) {
    super(gameType, 2)
  }

  // eslint-disable-next-line
  protected generatePlayers(numOfPlayers: number): WarPlayer[] {
    const players: WarPlayer[] = []

    for (let i: number = 0; i < numOfPlayers; i += 1) {
      if (i === 0) {
        players.push(new WarPlayer(PlayerTypes.Ai, 'bot'))
      } else {
        players.push(new WarPlayer(PlayerTypes.Player, 'you'))
      }
    }
    return players
  }

  public resetGame(): void {
    this.deck.resetDeck()
    this.resetPlayersBet()
    this.resetPlayersHand()
    this.resetAcquiredCards()
  }

  private resetPlayersHand(): void {
    this.players.forEach((player: WarPlayer) => player.resetHand())
  }

  private resetAcquiredCards(): void {
    // eslint-disable-next-line
    this.players.forEach((player: WarPlayer) => (player.acquiredCards = 0))
  }
}
