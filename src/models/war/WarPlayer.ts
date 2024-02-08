import Hand from '@/models/common/Hand'
import Player from '@/models/common/Player'
import PlayerTypes from '@/types/common/player-types'

export default class WarPlayer extends Player<Hand> {
  private _acquiredCards: number

  private readonly _isPlayer: boolean

  constructor(playerType: PlayerTypes, playerName: string) {
    super(playerType, playerName)

    this._hand = this.generateHand()
    this._acquiredCards = 0
    this._isPlayer = playerType === PlayerTypes.Player
  }

  // eslint-disable-next-line
  protected generateHand(): Hand {
    return new Hand()
  }

  public addAcquiredCards(amount: number): void {
    this._acquiredCards += amount
  }

  get acquiredCards(): number {
    return this._acquiredCards
  }

  set acquiredCards(amount: number) {
    this._acquiredCards = amount
  }

  get isPlayer(): boolean {
    return this._isPlayer
  }
}
