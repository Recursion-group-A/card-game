import Hand from '@/models/common/Hand'
import Player from '@/models/common/Player'
import PlayerTypes from '@/types/common/player-types'

export default class WarPlayer extends Player<Hand> {
  private _acquiredCards: number

  constructor(playerType: PlayerTypes, playerName: string) {
    super(playerType, playerName)

    this._acquiredCards = 0
    this.generateHand()
  }

  // eslint-disable-next-line
  protected generateHand(): Hand {
    return new Hand()
  }
}
