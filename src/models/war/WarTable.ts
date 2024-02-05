import Hand from '@/models/common/Hand'
import WarPlayer from '@/models/war/WarPlayer'
import Table from '@/models/common/Table'
import PlayerTypes from '@/types/common/player-types'
import { GameTypes } from '@/types/common/game-types'

export default class WarTable extends Table<WarPlayer, Hand> {
  private _cardsOnTable: number

  constructor(gameType: GameTypes) {
    super(gameType, 2)

    this._cardsOnTable = 0
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
}
