'use client'

import Phaser from 'phaser'
import React, { useEffect } from 'react'
import gameConfig from '@/phaser/common/config'

export default function PhaserComponent() {
  useEffect(() => {
    ;(async () => {
      const game: Phaser.Game = new Phaser.Game(gameConfig)

      return (): void => {
        game.destroy(true)
      }
    })()
  }, [])

  return <div id="phaser-game" />
}
