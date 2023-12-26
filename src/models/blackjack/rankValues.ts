import { Rank } from '@/types/common/rank-types'

const rankValues: { [key in Rank]: number } = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 10,
  Q: 10,
  K: 10,
  A: 1,
  Joker: 0
}

export default rankValues
