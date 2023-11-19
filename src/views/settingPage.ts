import { SETTINGPAGE } from "@/config";

export class settingPage{
    public static render(): void{
        // 長濱
        SETTINGPAGE?.innerHTML =
        `
            <div class="img-set-blackjack flex justify-center items-center py-5 bg-cover h-screen w-screen">
                <form class="setBlackjackForm">
            
                    <h1 class="text-white p-5 block mb-2 font-bold text-5xl text-white">Let's play BlackJack!</h1>
                    
                    <!-- input user name -->
                    <div class="mb-4">
                        <label class="block mb-2 font-bold text-xl text-white">NAME</label>
                        <input class="w-full px-3 py-2 border rounded-xl  shadow-xl"  
                            id="userName" type="text" placeholder="Name" required>
                    </div>

                    <!-- select game
                    <div class="mb-4">
                        <label class="block mb-2 font-bold text-white text-xl">GAME</label>
                        <select class="w-full px-3 py-3 border rounded-xl focus:outline-green-600 shadow-xl" id="gameType">
                        <option selected disabled>Plaese select game</option>
                        <option value="blackjack">BlackJack</option>
                        <option value="poker">Poker</option>
                        <option value="speed">Speed</option>
                        <option value="newGame" disabled>-New Game is coming soon-</option>
                        </select>
                    </div> -->

                    <!-- select number of CP -->
                    <div class="mb-4">
                        <label class="block mb-2 font-bold text-white text-xl">Select the number of CP</label>
                        <select class="w-full px-3 py-3 border rounded-xl focus:outline-green-600 shadow-xl" id="amoutCP">
                        <option selected disabled>How many CPs?</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        </select>
                    </div>
                    
                    <!-- start button -->
                    <button id="startBtn" 
                            class="mb-4 w-full mt-3 px-4 py-3 font-bold text-white bg-green-600 rounded-xl hover:bg-green-500 shadow-xl transition-colors duration-300"
                            type="submit">
                            START GAME
                    </button>

                    <button id="backBtn"
                            class="mb-4 w-full mt-3 px-4 py-3 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 shadow-xl transition-colors duration-300"
                            type="submit">
                            Back Home..
                    </button>
                </form>
            </div> 
        `
    }
}