import React from 'react'
import CardView from './cardView'
import ActionVew from './actionView'

export default function createBlackjackMainPage() {
  return (
    <div className="flex h-screen justify-center bg-green-500 font-bold text-white">
      <div id="dealor" className="container p-3">
        <p className="text-center text-3xl text-yellow-200">Dealor</p>
        <div className="flex justify-center py-2">
          <div
            id="dealorScore"
            className="cursor-default rounded-full bg-white px-4 py-2 text-xl text-black"
          >
            <p>score: 0</p>
          </div>
        </div>
        <div id="dealorStatus" className="flex justify-center pb-2 pt-1">
          <p className="w-40 cursor-default rounded-lg bg-red-600 px-4 py-2 text-center text-xl text-white shadow-xl">
            Waiting
          </p>
        </div>
        <div id="dealorCard" className="relative flex justify-center py-2">
          ${CardView.render()}${CardView.render()}
        </div>

        <div id="player" className="flex justify-center  pt-6">
          <div id="CP1" className="flex w-1/4 flex-col items-center">
            <p className="text-center text-3xl text-yellow-200">CP1</p>
            <div className="flex justify-center py-2">
              <div
                id="CP1Score"
                className="cursor-default rounded-full bg-white px-4 py-2 text-xl text-black"
              >
                <p>score: 0</p>
              </div>
            </div>
            <div id="CP1Status" className="flex justify-center pb-2 pt-1">
              <p className="w-40 cursor-default rounded-lg bg-red-600 px-4 py-2 text-center text-xl text-white shadow-xl">
                Waiting
              </p>
            </div>
            <div id="CP1Card" className="relative flex justify-center py-2">
              ${CardView.render()}${CardView.render()}
            </div>
          </div>

          <div id="user" className="flex w-1/2 flex-col items-center">
            <p className="text-center text-3xl text-yellow-200">User</p>
            <div className="flex justify-center py-2">
              <div
                id="userScore"
                className="cursor-default rounded-full bg-white px-4 py-2 text-xl text-black"
              >
                <p>score: 0</p>
              </div>
            </div>
            <div id="userStatus" className="flex justify-center pb-2 pt-1">
              <p className="w-40 cursor-default rounded-lg bg-red-600 px-4 py-2 text-center text-xl text-white shadow-xl">
                Waiting
              </p>
            </div>
            <div id="userCard" className="relative flex justify-center py-2">
              ${CardView.render()}${CardView.render()}
            </div>
            <div id="userAction">${ActionVew.render()}</div>
          </div>
          <div id="CP2" className="flex w-1/4 flex-col items-center">
            <p className="text-center text-3xl text-yellow-200">CP2</p>
            <div className="flex justify-center py-2">
              <div
                id="CP2Score"
                className="cursor-default rounded-full bg-white px-4 py-2 text-xl text-black"
              >
                <p>score: 0</p>
              </div>
            </div>
            <div id="dealorStatus" className="flex justify-center pb-2 pt-1">
              <p className="w-40 cursor-default rounded-lg bg-red-600 px-4 py-2 text-center text-xl text-white shadow-xl">
                Waiting
              </p>
            </div>
            <div id="CP2Card" className="relative flex justify-center py-2">
              ${CardView.render()}${CardView.render()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
