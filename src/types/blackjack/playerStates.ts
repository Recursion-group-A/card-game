export enum PlayerStatus {
  Broken = 'Broken',
  Wait = 'Wait',
  Stand = 'Stand',
  DoubleDown = 'Double',
  Surrender = 'Surrender',
  Bust = 'Bust',
  Blackjack = 'Blackjack'
}

// 完了したアクションの状態を配列で定義
export const COMPLETED_ACTIONS: PlayerStatus[] = [
  PlayerStatus.Stand,
  PlayerStatus.Bust,
  PlayerStatus.DoubleDown,
  PlayerStatus.Surrender,
  PlayerStatus.Blackjack
]
