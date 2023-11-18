import { STARTPAGE } from "@/config";

export class startPage{
    public static render():void{


        // testtesttest
        // naoto nishimura


        STARTPAGE?.innerHTML = 
        `
            <div class="img-start text-center flex justify-center items-center py-5 bg-cover h-screen w-screen">
                <form class="startGameForm">
                    <h1 class="p-5 block mb-2 font-bold text-5xl text-green-600">Welcom to Card Game station!</h1>
                    <p class="block font-bold text-2xl text-white">Which game do you want to play? Click!</p>
                    <div class="p-3 flex">
                        <button id="startBlackjack" class="m-3 rounded border bg-yellow-500 hover:bg-yellow-400 p-3 flex-1 font-bold text-2xl">Black Jack</button>
                        <button id="startPoker" class="m-3 rounded border bg-yellow-500 hover:bg-yellow-400 p-3 flex-1 font-bold text-2xl">Poker</button>
                        <button id="startSpeed" class="m-3 rounded border bg-yellow-500 hover:bg-yellow-400 p-3 flex-1 font-bold text-2xl">Speed</button>
                        <button id="startComingSoon" class="m-3 rounded border bg-yellow-500 hover:bg-yellow-400 p-3 flex-1 font-bold text-2xl">Coming soon..</button>
                    </div> 
                </form>
            </div>
        `
    }
}