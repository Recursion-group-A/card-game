import Phaser from "phaser";
import SpeedCard from "./SpeedCard";

export default class SpeedDeck{
    private cards: SpeedCard[]

    constructor(
        scene:Phaser.Scene,
        x:number,
        y:number,
        gameType?:string,
        playerType?:string)
        {
        this.cards = []
        this.createDeck(scene,x,y,gameType,playerType)
        this.shuffle()
    }

    public createDeck(
        scene:Phaser.Scene,
        x:number,
        y:number,
        gameType?:string,
        playerType?:string
        ):void{
        const suits = ["♥︎", "♦", "♣", "♠"]
        const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]

        if(gameType === "speed"){
            if(playerType === "house"){
                for(let i=0; i<suits.length-2; i++){
                    for(let j=0; j < ranks.length; j+=1){
                        this.cards.push(new SpeedCard(scene,x,y,suits[i],ranks[j],true))
                    }
                }
            }else{
                for(let i=2;i<suits.length-2; i++){
                    for(let j=0; j<ranks.length; j++){
                        this.cards.push(new SpeedCard(scene,x,y,suits[i],ranks[j],true))
                    }
                }
            }
        }else{
            for(let i=0; i < suits.length; i++){
                for(let j=0; j<ranks.length; j++){
                    this.cards.push(new SpeedCard(scene,x,y,suits[i],ranks[j],true))
                }
            }
        }
    }

    public shuffle(): void{
        let deckSize = this.cards.length
        for(let i = deckSize - 1; i >= 0; i --){
            const j = Math.floor(Math.random() * (i+1));
            const temp = this.cards[i]
            this.cards[i] = this.cards[j]
            this.cards[j] = temp
        }
    }

    public drawOne():SpeedCard| undefined{
        return this.cards.pop()
    }

    public getDeckSize(): number{
        return this.cards.length
    }
}