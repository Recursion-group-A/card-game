import { PLAYERTYPE, Rank } from "@/constants/constants";
import  Card  from "@/components/Card";
import { Hand } from "@/components/Hand";

// 一旦ブラックジャック特有のPlayerクラスです！
// abstractを削除しました！

export class Player {
  protected playerName: string;
  protected playerType: PLAYERTYPE;
  protected gameType: string;
  protected chips: number;
  protected bet: number;
  protected winAmount: number;
  protected currentTurn: number;
  protected hand: Hand;
  protected status: string;
  protected blackjack: boolean;

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

  protected initializeChips(): void {
    this.chips = 1000;
  }

  protected initializeBet(): void {
    this.bet = 0;
  }

  protected initializeWinAmount(): void {
    this.winAmount = 0;
  }

  protected initializeCurrentTurn(): void {
    this.currentTurn = 1;
  }

  protected initializeStatus(): void {
    this.status = "betting";
  }

  // 1ゲーム終了ごとに、ベット、ターン、状態、を初期化する
  protected initialize(): void {
    this.initializeBet();
    this.initializeCurrentTurn();
    this.initializeStatus();
  }

  protected getPlayerName(): string {
    return this.playerName;
  }

  protected getPlayerType(): PLAYERTYPE {
    return this.playerType;
  }

  protected getHand(): Hand {
    return this.hand;
  }

  protected getChips(): number {
    return this.chips;
  }

  protected getBet(): number {
    return this.bet;
  }

  protected getWinAmount(): number {
    return this.winAmount;
  }

  protected getCurrentTurn(): number {
    return this.currentTurn;
  }

  protected getStatus(): string {
    return this.status;
  }

  protected getHandScore(): number {
    const currentHand: Card[] = this.hand.getHand();
    const handScore: number = currentHand.reduce(
      (totalScore, card) => totalScore + card.getRankNumber(),
      0
    );

    return handScore;
  }

  protected addHand(card: Card): void {
    this.hand.addOne(card);
  }

  protected addChips(amount: number): void {
    this.chips += amount;
  }

  protected addBet(amount: number): void {
    this.bet += amount;
  }

  protected addCurrentTurn(): void {
    this.currentTurn++;
  }

  protected removeBet(amount: number): void {
    this.bet -= amount;
  }

  protected removeChips(amount: number): void {
    this.chips -= amount;
  }

  protected changeBet(amount: number): void {
    this.bet = amount;
  }

  protected changeStatus(status: string): void {
    this.status = status;
  }

  protected isFirstTurn(): boolean {
    return this.currentTurn === 1;
  }

  protected canBet(bet: number): boolean {
    return this.bet + bet <= this.chips;
  }

  protected decideAiPlayerBetAmount(): void {
    // chipsが1000に設定されていたので、1割-2割の間でベット額が決まるようにしました。
    // Recursionの課題通りchipsを400で行うのであれば変更します！
    const max: number = Math.floor(this.chips * 0.2);
    const min: number = Math.floor(this.chips * 0.1);
    const betAmount: number = Math.floor(Math.random() * (max - min) + min);

    this.bet = betAmount;
  }

  protected setToBroken(): void {
    this.changeStatus("broken");
  }

  protected setToBetting(): void {
    this.changeStatus("betting");
  }

  protected setToWaiting(): void {
    this.changeStatus("waiting");
  }

  protected setToStand(): void {
    this.changeStatus("stand");
  }

  protected setToHit(): void {
    this.changeStatus("hit");
  }

  protected setToDouble(): void {
    this.changeStatus("double");
  }

  protected setToSurrender(): void {
    this.changeStatus("surrender");
  }

  protected setToBust(): void {
    this.changeStatus("bust");
  }

  protected setToBlackjack(): void {
    this.changeStatus("blackjack");
  }

  protected setBlackjack(): void {
    if (this.isFirstTurn()) {
      const rankArr: Rank[] = [];

      for (const card of this.hand.getHand()) {
        rankArr.push(card.getRank());
      }

      if (this.isBlackjackSet(rankArr)) {
        this.blackjack = true;
        this.setToBlackjack();
      }
    }
  }

  protected isBlackjackSet(rankArr: Rank[]): boolean {
    return rankArr.includes("A") && /(10|J|Q|K)/.test(rankArr.join(" "));
  }

  protected isBlackjack(): boolean {
    return this.blackjack;
  }

  // ディーラーの場合を考慮する
  protected isBroken(): boolean {
    return this.chips <= 0;
  }

  protected isBust(): boolean {
    const currentScore = this.getHandScore();
    return currentScore > 21;
  }

  protected canHit(): boolean {
    if (this.blackjack) return false;

    const currentScore: number = this.getHandScore();

    return currentScore < 21;
  }

  protected canDouble(): boolean {
    if (this.blackjack) return false;

    const doubleBet: number = this.getBet() * 2;
    const currentChips: number = this.getChips();

    return this.isFirstTurn() && doubleBet <= currentChips;
  }

  protected canSurrender(): boolean {
    if (this.blackjack) return false;

    const halfBet: number = Math.floor(this.getBet() / 2);

    return this.isFirstTurn() && halfBet > 0;
  }

  protected broken(): void {
    this.setToBroken();
  }

  protected bust(): void {
    this.setToBust();
  }

  protected hit(): void {
    this.setToHit();
  }

  protected stand(): void {
    this.setToStand();
  }

  protected double(): void {
    this.removeChips(this.bet);
    this.addBet(this.bet);
    this.setToDouble();
  }

  protected surrender(): void {
    const currentBet: number = this.bet;

    this.removeBet(Math.floor(currentBet / 2));
    this.addChips(Math.floor(currentBet / 2));
    this.setToSurrender();
  }
}