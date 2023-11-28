'use client'

import React from 'react'
import Link from 'next/link'
import Controller from '@/controllers/poker/Controller'
import { GAMETYPE } from '@/types/gameTypes'

export default function Home() {
  const handlePokerStart = () => {
    const controller: Controller = new Controller(GAMETYPE.Poker)
    controller.startPoker()
  }

  return (
    <div className="img-start flex h-screen w-screen items-center justify-center bg-cover py-5 text-center">
      <form id="startGameForm">
        <h1 className="mb-2 block p-5 text-5xl font-bold text-green-600">
          Welcome to Card Game station!
        </h1>
        <p className="block text-2xl font-bold text-white">
          Which game do you want to play? Click!
        </p>
        <div className="flex p-3">
          <button
            id="startBlackjack"
            type="button"
            className="m-3 flex-1 rounded border bg-yellow-500 p-3 text-2xl font-bold hover:bg-yellow-400"
          >
            Black Jack
          </button>
          <Link href="/games/poker/">
            <button
              id="startPoker"
              type="button"
              className="m-3 flex-1 rounded border bg-yellow-500 p-3 text-2xl font-bold hover:bg-yellow-400"
              onClick={handlePokerStart}
            >
              Poker
            </button>
          </Link>
          <button
            id="startSpeed"
            type="button"
            className="m-3 flex-1 rounded border bg-yellow-500 p-3 text-2xl font-bold hover:bg-yellow-400"
          >
            Speed
          </button>
          <button
            id="startComingSoon"
            type="button"
            className="m-3 flex-1 rounded border bg-yellow-500 p-3 text-2xl font-bold hover:bg-yellow-400"
          >
            Coming soon..
          </button>
        </div>
      </form>
    </div>
    // <div className="flex h-screen h-screen justify-center bg-green-500 text-white items-center">
    //   <div className="pb-3 comtainer">
    //     <p id="dealor" className="text-3xl text-center items-center justify-center">Dealorrrr</p>

    //   </div>

    // </div>
  )
}
