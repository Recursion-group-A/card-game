import Card from '@/models/common/Card'
import Hand from '@/models/common/Hand'
import PokerPlayer from '@/models/poker/PokerPlayer'
import PokerTable from '@/models/poker/PokerTable'
import PokerRound from '@/types/poker/round-types'
import PokerHand from '@/types/poker/hand-types'
import PokerActions from '@/types/poker/action-types'
import PokerHandEvaluator from '@/models/poker/PokerHandEvaluator'

export default class BotDecisionMaker {
  private readonly HIGH_CARD_RANK = 12

  private readonly GOOD_CARD_RANK = 7

  private readonly _table: PokerTable

  constructor(table: PokerTable) {
    this._table = table
  }

  public determineAIAction(player: PokerPlayer): PokerActions {
    if (player.lastAction === PokerActions.Raise) {
      return PokerActions.Call
    }

    const handRank: PokerHand = PokerHandEvaluator.evaluateHand(
      player.hand.cards,
      this.table.communityCards.cards
    )

    switch (this.table.round) {
      case PokerRound.PreFlop:
        return this.decidePreFlopAction(player, handRank)
      case PokerRound.Flop:
        return this.decideFlopAction(handRank)
      case PokerRound.Turn:
        return this.decideTurnAction(handRank)
      case PokerRound.River:
        return this.decideRiverAction(handRank)
      default:
        throw new Error('Unknown PokerRound')
    }
  }

  private decidePreFlopAction(
    player: PokerPlayer,
    rank: PokerHand
  ): PokerActions {
    if (rank >= PokerHand.OnePair) {
      return this.decideActionForOnePair(player.hand)
    }
    return this.decideActionForNoPair(player.hand)
  }

  private decideFlopAction(rank: PokerHand): PokerActions {
    const someoneRaised: boolean = this.table.anyoneRaisedThisRound()

    if (rank >= PokerHand.ThreeOfAKind && !someoneRaised) {
      return PokerActions.Raise
    }
    if (someoneRaised && rank <= PokerHand.HighCard) {
      return PokerActions.Fold
    }
    return PokerActions.Call
  }

  private decideTurnAction(rank: PokerHand): PokerActions {
    const someoneRaised: boolean = this.table.anyoneRaisedThisRound()

    if (rank >= PokerHand.Straight && !someoneRaised) {
      return PokerActions.Raise
    }
    if (someoneRaised && rank <= PokerHand.HighCard) {
      return PokerActions.Fold
    }
    return PokerActions.Call
  }

  private decideRiverAction(rank: PokerHand): PokerActions {
    const someoneRaised: boolean = this.table.anyoneRaisedThisRound()

    if (rank >= PokerHand.Flush && !someoneRaised) {
      return PokerActions.Raise
    }
    if (someoneRaised && rank <= PokerHand.OnePair) {
      return PokerActions.Fold
    }
    return PokerActions.Call
  }

  private decideActionForOnePair(hand: Hand): PokerActions {
    if (this.allCardsAboveEleven(hand) && !this.table.anyoneRaisedThisRound()) {
      return PokerActions.Raise
    }
    return PokerActions.Call
  }

  private decideActionForNoPair(hand: Hand): PokerActions {
    if (hand.getHandTotal() >= this.GOOD_CARD_RANK * 2) {
      return PokerActions.Call
    }
    return PokerActions.Fold
  }

  private allCardsAboveEleven(hand: Hand): boolean {
    return hand.cards.every(
      (card: Card) => card.getRankNumber() >= this.HIGH_CARD_RANK
    )
  }

  get table(): PokerTable {
    return this._table as PokerTable
  }
}
