import { Scene } from "phaser";

export const CARD_ATLAS_KEY = "Cards"
export const cardHeight = 190
export const cardWidth = 140

export default class CreateCard{
    constructor(scene:Scene,textUrl:string,atlasUrl:string){
        scene.load.atlasXML(CARD_ATLAS_KEY,textUrl,atlasUrl)
    }

}