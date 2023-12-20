`use client`

import Phaser from "phaser"
import React, {useEffect} from "react"

export default function Page(){
    useEffect(() => {
        ;(async () => {
            const game: Phaser.Game = new Phaser.Game()

            return(): void => {
                game.destroy(true)
            }
        })()
    }
    )
}