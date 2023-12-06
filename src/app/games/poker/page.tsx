'use client'

import Phaser from 'phaser'
import React, { useEffect } from 'react'
import gameConfig from '@/phaser/poker/config'

export default function Page() {
  useEffect(() => {
    ;(async () => {
      const game: Phaser.Game = new Phaser.Game(gameConfig)

      // アンマウント時の処理
      return (): void => {
        game.destroy(true)
      }
    })()
  }, [])

  return <div id="phaser-poker-game" />
}
