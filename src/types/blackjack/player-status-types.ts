export enum PlayerStatus {
  Broken = 'broken',
  Wait = 'wait',
  Stand = 'stand',
  DoubleDown = 'double',
  Surrender = 'surrender',
  Bust = 'bust',
  Blackjack = 'blackjack'
}

// 完了したアクションの状態を配列で定義
export const COMPLETED_ACTIONS: PlayerStatus[] = [
  PlayerStatus.Stand,
  PlayerStatus.Bust,
  PlayerStatus.DoubleDown,
  PlayerStatus.Surrender,
  PlayerStatus.Blackjack
]
