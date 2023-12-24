import Hand from '@/models/common/Hand'
import Player from '@/models/common/Player'
import PokerHand from '@/types/poker/PokerHand'
import PLAYERTYPES from '@/types/common/playerTypes'
import PokerAction from '@/types/poker/PokerAction'

export default class PokerPlayer extends Player<Hand> {
  private _isActive: boolean

  private _lastAction: PokerAction

  private _bestHand: PokerHand | undefined

  constructor(playerType: PLAYERTYPES, playerName: string) {
    super(playerType, playerName)

    this.generateHand()
    this._isActive = true
    this._lastAction = PokerAction.NO_ACTION
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

  get lastAction(): PokerAction {
    return this._lastAction
  }

  set lastAction(action: PokerAction) {
    this._lastAction = action
  }

  get bestHand(): PokerHand | undefined {
    return this._bestHand
  }

  set bestHand(bestHand: PokerHand | undefined) {
    this._bestHand = bestHand
  }
}
