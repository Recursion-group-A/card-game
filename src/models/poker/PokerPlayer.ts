import Hand from '@/models/common/Hand'
import Player from '@/models/common/Player'
import PokerHands from '@/types/poker/hand-types'
import PlayerTypes from '@/types/common/player-types'
import PokerActions from '@/types/poker/action-types'

export default class PokerPlayer extends Player<Hand> {
  private _isActive: boolean

  private _lastAction: PokerActions

  private _bestHand: PokerHands | undefined

  constructor(playerType: PlayerTypes, playerName: string) {
    super(playerType, playerName)

    this.generateHand()
    this._isActive = true
    this._lastAction = PokerActions.NoAction
  }

  // eslint-disable-next-line
  protected generateHand(): Hand {
    return new Hand()
  }

  get isActive(): boolean {
    return this._isActive
  }

  set isActive(bool: boolean) {
    this._isActive = bool
  }

  get lastAction(): PokerActions {
    return this._lastAction
  }

  set lastAction(action: PokerActions) {
    this._lastAction = action
  }

  get bestHand(): PokerHands | undefined {
    return this._bestHand
  }

  set bestHand(bestHand: PokerHands | undefined) {
    this._bestHand = bestHand
  }
}
