export default class PlayerBetView {
  public static render() {
    return `
    
        <div className="flex flex-col justify-center items-center px-7 py-3">
            <div className="flex flex-justify-around py-6">
                <div className="px-2">
                    <button className="text-xl font-bold text-white w-16 h-16 bg-red-500 rounded-full shadow-xl flex justify-center items-center cursor-pointer hover:opacity-80">
                    $5
                    </button>
                </div>
                <div className="px-2">
                    <button className="text-xl font-bold text-white  w-16 h-16 bg-green-500 rounded-full shadow-xl flex justify-center items-center cursor-pointer hover:opacity-80">
                    $10
                    </button>
                </div>
                <div className="px-2">
                    <button className="text-xl font-bold text-white  w-16 h-16 bg-blue-500 rounded-full shadow-xl flex justify-center items-center cursor-pointer hover:opacity-80">
                    $50
                    </button>
                </div>
                <div className="px-2">
                    <button className="$50< w-16 h-16 bg-yellow-500 rounded-full shadow-xl flex justify-center items-center cursor-pointer hover:opacity-80">
                    $100
                    </button>
                </div>
            </div>
            <div className="flex justify-between">
                <button id="clearBtn" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-red-700 shadow-lg shadow-red-600/50 font-bold rounded-lg w-32 py-2.5 mx-3">
                CLEAR
                </button>
                <button id="dealBtn" className="text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:opacity-80 focus:ring-2 focus:outline-none focus: ring-green-600 shadow-lg shadow-green-600/50 font-bold rounded-lg w-32 py-2.5 mx-3">
                DEAL
                </button>
            </div>
        </div>
        `
  }
}
