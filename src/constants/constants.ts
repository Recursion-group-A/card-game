// TODO: ファイルごとに分割する
export type Suit = 'H' | 'D' | 'C' | 'S'
export type Rank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'A'
  | 'Joker'
export type PLAYERTYPE = 'player' | 'house' | 'ai'

export const SUITS: Suit[] = ['H', 'D', 'C', 'S']
export const RANKS: Rank[] = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K'
]
export const GAMESWITHJOKER: GAMETYPE[] = []
export enum GAMETYPE {
  Blackjack = 'blackjack',
  Poker = 'poker'
}

export const GAMEPHASE = {
  BETTING: 'betting',
  ACTING: 'acting',
  EVALUATING: 'evaluating',
  SETTLEMENT: 'settlement',
  PREPARATION: 'preparation'
}

export const PLAYER_STATES = {
  STAND: 'Stand',
  BUST: 'Bust',
  DOUBLE_DOWN: 'Double',
  SURRENDER: 'Surrender',
  BLACKJACK: 'Blackjack'
  // その他の状態も必要に応じて追加
}

// 完了したアクションの状態を配列で定義
export const COMPLETED_ACTIONS = [
  PLAYER_STATES.STAND,
  PLAYER_STATES.BUST,
  PLAYER_STATES.DOUBLE_DOWN,
  PLAYER_STATES.SURRENDER,
  PLAYER_STATES.BLACKJACK
]
