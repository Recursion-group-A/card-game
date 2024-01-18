export enum ParticipantStatuses {
  Broken = 'broken',
  Wait = 'wait',
  Stand = 'stand',
  DoubleDown = 'double',
  Surrender = 'surrender',
  Bust = 'bust',
  Blackjack = 'blackjack'
}

// 完了したアクションの状態を配列で定義
export const COMPLETED_ACTIONS: ParticipantStatuses[] = [
  ParticipantStatuses.Stand,
  ParticipantStatuses.Bust,
  ParticipantStatuses.DoubleDown,
  ParticipantStatuses.Surrender,
  ParticipantStatuses.Blackjack
]
