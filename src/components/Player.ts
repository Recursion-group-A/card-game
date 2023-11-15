import { PLAYERTYPE } from "@/constants/constants"
import { Card } from "@/components/Card"
import { Hand } from "@/components/Hand"


export abstract class Player {
    protected name: string;
    protected playerType: PLAYERTYPE;
    protected hand: Hand;
    protected chips: number;
    protected bet: number;
    protected winAmount: number;
    protected gameType: string;

    constructor(name: string, playerType: PLAYERTYPE, gameType: string, chips: number = 1000) {
        this.name = name;
        this.playerType = playerType;
        this.hand = new Hand();
        this.chips = chips;
        this.bet = 0;
        this.winAmount = 0;
        this.gameType = gameType;
    }
}
