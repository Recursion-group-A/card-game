import { PLAYERTYPE, Rank } from "@/constants/constants";
import  Card  from "@/components/Card";
import Hand from "@/components/Hand";

// 一旦ブラックジャック特有のPlayerクラスです！
// abstractを削除しました！

export class Player {
  private playerName: string;
  private playerType: PLAYERTYPE;
  private gameType: string;
  private chips: number;
  private bet: number;
  private winAmount: number;
  private currentTurn: number;
  private hand: Hand;
  private status: string;
  private blackjack: boolean;

  constructor(
    playerName: string,
    playerType: PLAYERTYPE,
    gameType: string,
    chips: number = 1000
  ) {
    this.playerName = playerName;
    this.playerType = playerType;
    this.gameType = gameType;
    this.chips = chips;
    this.bet = 0;
    this.winAmount = 0;
    this.currentTurn = 1;
    this.hand = new Hand();
    this.status = "betting";
    this.blackjack = false;
  }

  public initializeChips(): void {
    this.chips = 1000;
  }

  public initializeBet(): void {
    this.bet = 0;
  }

  public initializeWinAmount(): void {
    this.winAmount = 0;
  }

  public initializeCurrentTurn(): void {
    this.currentTurn = 1;
  }

  public initializeHand(): void {
    this.hand.cleanHand();
  }

  public initializeStatus(): void {
    this.status = "betting";
  }

  // 1ゲーム終了ごとに、ベット、ターン、状態、を初期化する
  public prepareForNextRound(): void {
    this.initializeBet();
    this.initializeCurrentTurn();
    this.initializeHand();
    this.initializeStatus();
  }

  public getPlayerName(): string {
    return this.playerName;
  }

  public getPlayerType(): PLAYERTYPE {
    return this.playerType;
  }

  public getHand(): Card[] {
    return this.hand.getHand();
  }

  public getChips(): number {
    return this.chips;
  }

  public getBet(): number {
    return this.bet;
  }

  public getWinAmount(): number {
    return this.winAmount;
  }

  public getCurrentTurn(): number {
    return this.currentTurn;
  }

  public getStatus(): string {
    return this.status;
  }

  public getHandTotalScore(): number {
    return this.hand.getHandTotalScore();
  }

  public addHand(card: Card): void {
    this.hand.addOne(card);
  }

  public addChips(amount: number): void {
    this.chips += amount;
  }

  public addBet(amount: number): void {
    this.bet += amount;
  }

  public incrementCurrentTurn(): void {
    this.currentTurn++;
  }

  public removeBet(amount: number): void {
    this.bet -= amount;
  }

  public removeChips(amount: number): void {
    this.chips -= amount;
  }

  public changeBet(amount: number): void {
    this.bet = amount;
  }

  public changeStatus(status: string): void {
    this.status = status;
  }

  public isFirstTurn(): boolean {
    return this.currentTurn === 1;
  }

  public canBet(bet: number): boolean {
    return this.bet + bet <= this.chips;
  }

  public decideAiPlayerBetAmount(): void {
    // chipsが1000に設定されていたので、1割-2割の間でベット額が決まるようにしました。
    // Recursionの課題通りchipsを400で行うのであれば変更します！
    const max: number = Math.floor(this.chips * 0.2);
    const min: number = Math.floor(this.chips * 0.1);
    const betAmount: number = Math.floor(Math.random() * (max - min) + min);

    this.bet = betAmount;
  }

  public setToBroken(): void {
    this.changeStatus("broken");
  }

  public setToBetting(): void {
    this.changeStatus("betting");
  }

  public setToWaiting(): void {
    this.changeStatus("waiting");
  }

  public setToStand(): void {
    this.changeStatus("stand");
  }

  public setToHit(): void {
    this.changeStatus("hit");
  }

  public setToDouble(): void {
    this.changeStatus("double");
  }

  public setToSurrender(): void {
    this.changeStatus("surrender");
  }

  public setToBust(): void {
    this.changeStatus("bust");
  }

  public setToBlackjack(): void {
    this.changeStatus("blackjack");
  }

  public setBlackjack(): void {
    if(this.hand.isBlackjack()) this.blackjack = true;
  }

  public isBlackjack(): boolean {
    return this.blackjack;
  }

  // ディーラーの場合を考慮する
  public isBroken(): boolean {
    return this.chips <= 0;
  }

  public isBust(): boolean {
    const currentScore = this.getHandTotalScore();
    return currentScore > 21;
  }

  public canHit(): boolean {
    if (this.blackjack) return false;

    const currentScore: number = this.getHandTotalScore();

    return currentScore < 21;
  }

  public canDouble(): boolean {
    if (this.blackjack) return false;

    const doubleBet: number = this.getBet() * 2;
    const currentChips: number = this.getChips();

    return this.isFirstTurn() && doubleBet <= currentChips;
  }

  public canSurrender(): boolean {
    if (this.blackjack) return false;

    const halfBet: number = Math.floor(this.getBet() / 2);

    return this.isFirstTurn() && halfBet > 0;
  }

  public broken(): void {
    this.setToBroken();
  }

  public bust(): void {
    this.setToBust();
  }

  public hit(): void {
    this.setToHit();
  }

  public stand(): void {
    this.setToStand();
  }

  public double(): void {
    this.removeChips(this.bet);
    this.addBet(this.bet);
    this.setToDouble();
  }

  public surrender(): void {
    const currentBet: number = this.bet;

    this.removeBet(Math.floor(currentBet / 2));
    this.addChips(Math.floor(currentBet / 2));
    this.setToSurrender();
  }
}