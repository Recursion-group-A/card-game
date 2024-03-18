'use client'

import React, { useEffect } from 'react'
import Phaser from 'phaser'
import gameConfig from '@/phaser/poker/config'

export default function PokerGame() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const game: Phaser.Game = new Phaser.Game(gameConfig)

      return (): void => {
        game.destroy(true)
      }
    }
    return (): void => {}
  }, [])

  return <div id="phaser-poker-game" />
}
