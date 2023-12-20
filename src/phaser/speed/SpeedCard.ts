import Phaser from "phaser";
import { CARD_ATLAS_KEY } from "./CreateCard";

export default class SpeedCard extends Phaser.GameObjects.Image{
    readonly suit: string
    readonly rank: string
    private faceDown: boolean
    public originalPositionX: number | undefined
    public originalPositionY: number |undefined

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        suit: string,
        rank: string,
        faceDown: boolean
    ){
        super(scene,x,y,"cardBack")
        scene.add.existing(this)
        this.suit = suit
        this.rank = rank
        this.faceDown = faceDown

        if(!faceDown){
            this.setFaceUp()
        }

        this.setInteractive()
    }

    get Suit(): string{
        return this.suit
    }

    public getFaceDown(): boolean{
        return this.faceDown
    }

    public setFaceDown(faceDown:boolean){
        this.faceDown = faceDown
    }

    get Rank():string{
        return this.rank
    }

    get FaceDown(): boolean{
        return this.faceDown
    }

    public getAtlasFrame(): string{
        return `card${this.suit}${this.rank}.png`
    }

    public setFaceUp():void{
        this.faceDown = false
        this.setTexture(CARD_ATLAS_KEY)
        this.setFrame(this.getAtlasFrame())
    }

    public enableClick():void{
        this.on("pointerdown",this.onClick,this)
        this.setOriginalPosition()
    }

    public disableClick(): void{
        this.off("pointerdown",this.onClick,this)
    }

    private onClick(): void{
        this.scene.sound.play("thock")
        if(this.y === this.originalPositionY){
            this.y -= 20
        }else{
            this.y = this.originalPositionY as number
        }
    }

    public playMoveTween(toX:number,toY:number):void{
        this.scene.sound.play("deal",{volume:0.5})
        this.scene.tweens.add({
            targets:this,
            x:toX,
            y:toY,
            duration:500,
            ease:"Linear"
        })
    }

    public setDrag(): void{
        this.setInteractive()
        this.scene.input.setDraggable(this)
    }

    public returnToOrigin():void{
        this.setPosition(this.input?.dragStartX,this.input?.dragStartY)
    }

    public playFlipOverTween():void{
        const originalScaleX = this.scaleX

        this.scene.tweens.add({
            targets: this,
            scaleX:0,
            duration:200,
            ease:"Linear",
            onComplete:() => {
                this.setFaceUp()
                this.setRotation(-Math.PI/2)

                this.scene.tweens.add({
                    targets:this,
                    rotation:0,
                    scaleX:originalScaleX,
                    duration:200,
                    delay:100,
                    ease:"Linear",
                    onStart:() => {
                        this.setAlpha(0)
                    },
                    onUpdate:(tween)=>{
                        const {progress} = tween
                        const alpha = Math.min(progress*2,1)
                        this.setAlpha(alpha)
                    },
                    onComplete:()=>{
                        this.setAlpha(1)
                        this.scene.sound.play("cardflip",{volume:0.5})
                    },
                })
            },
        })
    }

    public isMoveUp():boolean{
        return this.y !== this.originalPositionY
    }

    public setOriginalPosition():void{
        this.originalPositionX = this.x
        this.originalPositionY = this.y
    }

    public getRankNumber(gameType:string):number{
        let rankToNumber 
        switch(gameType){
            default:
                rankToNumber = {
                    A: 1,
                    '2': 2,
                    '3': 3,
                    '4': 4,
                    '5': 5,
                    '6': 6,
                    '7': 7,
                    '8': 8,
                    '9': 9,
                    '10': 10,
                    J: 11,
                    Q: 12,
                    K: 13,
                }
                break
        }
        return rankToNumber[this.rank] ?? 0
    }

}