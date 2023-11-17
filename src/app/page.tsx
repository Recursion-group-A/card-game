// import Image from 'next/image'


export default function Home() {
  return (
    <div className="awesome" style={{ border: "1px solid red" }}>
      <div className="img-start text-center flex justify-center items-center py-5 bg-cover h-screen w-screen">
        <form className="startGameForm">
          <h1 className="p-5 block mb-2 font-bold text-5xl text-green-600">
          Welcom to Card Game station!
          </h1>
          <p className="block font-bold text-2xl text-white">
          Which game do you want to play? Click!
          </p>
          <div className="p-3 flex">
            <button
            id="startBlackjack"
            className="m-3 rounded border bg-yellow-500 hover:bg-yellow-400 p-3 flex-1 font-bold text-2xl"
            >
            Black Jack
            </button>
            <button
            id="startPoker"
            className="m-3 rounded border bg-yellow-500 hover:bg-yellow-400 p-3 flex-1 font-bold text-2xl"
            >
            Poker
            </button>
            <button
            id="startSpeed"
            className="m-3 rounded border bg-yellow-500 hover:bg-yellow-400 p-3 flex-1 font-bold text-2xl"
            >
            Speed
            </button>
            <button
            id="startComingSoon"
            className="m-3 rounded border bg-yellow-500 hover:bg-yellow-400 p-3 flex-1 font-bold text-2xl"
            >
            Coming soon..
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
