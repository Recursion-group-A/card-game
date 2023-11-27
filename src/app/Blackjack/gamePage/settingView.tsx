import React from 'react'

export default function settingPageBlackjack() {
  return (
    <div className="img-set-blackjack flex h-screen w-screen items-center justify-center bg-cover py-5">
      <form id="setBlackjackForm">
        <h1 className="mb-2 block p-5 text-5xl font-bold text-white">
          Play BlackJack!
        </h1>

        <div className="mb-4">
          <label
            htmlFor="userName"
            className="mb-2 block text-xl font-bold text-white"
          >
            NAME
          </label>
          <input
            className="w-full rounded-xl border px-3 py-2  shadow-xl"
            id="userName"
            type="text"
            placeholder="Name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="amountCP"
            className="mb-2 block text-xl font-bold text-white"
          >
            Select the number of CP
          </label>
          <select
            className="w-full rounded-xl border p-3 shadow-xl focus:outline-green-600"
            id="amoutCP"
          >
            <option selected disabled>
              How many CPs?
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        <button
          id="startBtn"
          className="mb-4 mt-3 w-full rounded-xl bg-green-600 px-4 py-3 font-bold text-white shadow-xl transition-colors duration-300 hover:bg-green-500"
          type="submit"
        >
          START GAME
        </button>

        <button
          id="backBtn"
          className="mb-4 mt-3 w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white shadow-xl transition-colors duration-300 hover:bg-indigo-500"
          type="submit"
        >
          Back Home..
        </button>
      </form>
    </div>
  )
}
