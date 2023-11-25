export default class Pot {
  private totalPot: number

  constructor() {
    this.totalPot = 0
  }

  public addPot(amount: number): void {
    this.totalPot += amount
  }

  public getTotalPot(): number {
    return this.totalPot
  }

  public resetPot(): void {
    this.totalPot = 0
  }
}
