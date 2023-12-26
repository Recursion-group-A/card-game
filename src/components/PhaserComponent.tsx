'use client'

import * as Phaser from 'phaser'
import React, { useEffect } from 'react'
import gameConfig from '@/phaser/common/config'

export default function PhaserComponent() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const game: Phaser.Game = new Phaser.Game(gameConfig)

      return (): void => {
        game.destroy(true)
      }
    }
    return (): void => {}
  }, [])

  return <div id="phaser-game" />
}
