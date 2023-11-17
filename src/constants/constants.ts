export type Suit = "H" | "D" | "C" | "S"
export type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A"
  | "Joker"
export type PLAYERTYPE = "player" | "house" | "ai"

export const SUITS: Suit[] = ["H", "D", "C", "S"]
export const RANKS: Rank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
]
export const GAMESWITHJOKER: GAMETYPE[] = []
export enum GAMETYPE {
  Blackjack = "blackjack",
  Poker = "poker",
}
