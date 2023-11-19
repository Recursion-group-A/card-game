import { GAMETYPE,PLAYERTYPE } from "@/constants/constants";
import Card from "@/components/Card";
import Deck from "@/components/Deck"
import { Player } from "@/components/Player";
import House from "@/components/House";

export class Table {
    private gameType: GAMETYPE;
    private playerNumber: number;
    private betDenominations: number[];
    private deck: Deck;
    private round: number;
    private house: House;
    private players: Player[];
    private resultLog: string[];

    constructor(gameType: GAMETYPE, playerNumber: number
    ) {
        this.gameType = gameType;
        this.playerNumber = playerNumber;
        this.betDenominations = [5, 20, 50, 100];
        this.deck = new Deck(this.gameType);
        this.round = 1;
        this.house = new House();
        this.players = [];
        this.resultLog = [];

        this.setToPlayers();
        this.addPlayersHand();
    }

    public initializeDeck(): void {
        this.deck.resetDeck();
    }

    public initializeRound(): void {
        this.round = 1;
    }

    public initializePlayers(): void {
        this.players.forEach(player => {
            player.prepareForNextRound();
        });
    }

    public prepareForNextRound(): void {
        this.initializeDeck();
        this.initializeRound();
        this.initializePlayers();
    }

    public getGameType(): GAMETYPE {
        return this.gameType;
    }

    public getPlayerNumber(): number {
        return this.playerNumber;
    }

    public getRound(): number {
        return this.round;
    }

    public getResultLog(): string[] {
        return this.resultLog;
    }

    public addRound(): void {
        this.round++;
    }

    public changeHouseTurn(): void {
        this.house.drawUntilSeventeen(this.deck);
    }

    public setToPlayer(playerName: string, playerType: PLAYERTYPE): void {
        this.players.push(new Player(playerName, playerType, this.gameType));
    }

    public setToPlayers(): void {
        // 人間のplayerは常に一人という設定です
        this.setToPlayer("Player", "player");

        for(let i = 1; i < this.playerNumber; i++) {
            const computerName = "Computer_" + String(i);
            this.setToPlayer(computerName, "ai");
        }
    }

    public addHouseHand(): void {
        const card: Card | undefined = this.deck.drawOne();

        if(card !== undefined) {
            this.house.addCard(card);
        }
    }

    public addPlayersHand(): void {
        // 各々（house含む）に一枚ずつ配る行為を2巡する
        for(let i = 0; i < 2; i++) {
            this.players.forEach(player => {
                const card: Card | undefined = this.deck.drawOne();

                if(card !== undefined) {
                    player.addHand(card);
                }
            })

            this.addHouseHand();
        }
    }
}
