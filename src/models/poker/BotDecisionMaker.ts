import Card from '@/models/common/Card'
import Hand from '@/models/common/Hand'
import PokerPlayer from '@/models/poker/PokerPlayer'
import PokerTable from '@/models/poker/PokerTable'
import PokerRound from '@/types/poker/PokerRound'
import PokerHand from '@/types/poker/PokerHand'
import PokerAction from '@/types/poker/PokerAction'
import PokerHandEvaluator from '@/models/poker/PokerHandEvaluator'

export default class BotDecisionMaker {
  private readonly HIGH_CARD_RANK = 12

  private readonly GOOD_CARD_RANK = 7

  private readonly _table: PokerTable

  constructor(table: PokerTable) {
    this._table = table
  }

  public determineAIAction(player: PokerPlayer): PokerAction {
    if (player.lastAction === PokerAction.RAISE) {
      return PokerAction.CALL
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
  ): PokerAction {
    if (rank >= PokerHand.OnePair) {
      return this.decideActionForOnePair(player.hand)
    }
    return this.decideActionForNoPair(player.hand)
  }

  private decideFlopAction(rank: PokerHand): PokerAction {
    const someoneRaised: boolean = this.table.anyoneRaisedThisRound()

    if (rank >= PokerHand.ThreeOfAKind && !someoneRaised) {
      return PokerAction.RAISE
    }
    if (someoneRaised && rank <= PokerHand.HighCard) {
      return PokerAction.FOLD
    }
    return PokerAction.CALL
  }

  private decideTurnAction(rank: PokerHand): PokerAction {
    const someoneRaised: boolean = this.table.anyoneRaisedThisRound()

    if (rank >= PokerHand.Straight && !someoneRaised) {
      return PokerAction.RAISE
    }
    if (someoneRaised && rank <= PokerHand.HighCard) {
      return PokerAction.FOLD
    }
    return PokerAction.CALL
  }

  private decideRiverAction(rank: PokerHand): PokerAction {
    const someoneRaised: boolean = this.table.anyoneRaisedThisRound()

    if (rank >= PokerHand.Flush && !someoneRaised) {
      return PokerAction.RAISE
    }
    if (someoneRaised && rank <= PokerHand.OnePair) {
      return PokerAction.FOLD
    }
    return PokerAction.CALL
  }

  private decideActionForOnePair(hand: Hand): PokerAction {
    if (this.allCardsAboveEleven(hand) && !this.table.anyoneRaisedThisRound()) {
      return PokerAction.RAISE
    }
    return PokerAction.CALL
  }

  private decideActionForNoPair(hand: Hand): PokerAction {
    if (hand.getHandTotal() >= this.GOOD_CARD_RANK * 2) {
      return PokerAction.CALL
    }
    return PokerAction.FOLD
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
