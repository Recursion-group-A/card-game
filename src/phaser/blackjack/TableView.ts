import * as Phaser from 'phaser'
import Card from '@/models/common/Card'
import DeckView from '@/phaser/common/DeckView'
import BlackjackPlayer from '@/models/blackjack/BlackjackPlayer'
import PlayerView from '@/phaser/blackjack/PlayerView'
import BlackjackTable from '@/models/blackjack/BlackjackTable'
import PlayerTypes from '@/types/common/player-types'
import { PlayerStatus } from '@/types/blackjack/player-status-types'

export default class TableView extends Phaser.GameObjects.Container {
  private readonly _tableModel: BlackjackTable

  private readonly _playerModels: BlackjackPlayer[] = []

  private readonly _playerViews: PlayerView[] = []

  private readonly _deckView: DeckView

  private _sceneWidth: number = this.scene.cameras.main.width

  private _sceneHeight: number = this.scene.cameras.main.height

  constructor(scene: Phaser.Scene, tableModel: BlackjackTable) {
    super(scene)

    this._tableModel = tableModel
    this._deckView = new DeckView(
      this.scene,
      this._sceneWidth / 2,
      this._sceneHeight / 2
    )

    this.add(this._deckView)

    const playersPos: { x: number; y: number }[] = [
      { x: 750, y: 100 }, // プレイヤー
      { x: 750, y: 350 },
      { x: 450, y: 550 },
      { x: 150, y: 350 },
      { x: 150, y: 100 },
      { x: 450, y: 100 }
    ]

    // 下のメソッドたちをきれいにする
    // this._tableModel.initializePlayers()
    this._playerModels = this._tableModel.players
    this._playerModels.forEach((player: BlackjackPlayer, index: number) => {
      if (player.playerType === PlayerTypes.Ai) {
        player.decideAiPlayerBetAmount()
      }
      const playerView: PlayerView = new PlayerView(
        this.scene,
        player,
        playersPos[index]
      )
      this._playerViews.push(playerView)
      this.add(playerView)
    })

    scene.add.existing(this)
  }

  public dealCardAnimation(): void {
    const delayPerCard: number = 150

    for (let i: number = 0; i < 2; i += 1) {
      this._playerModels.forEach((player: BlackjackPlayer, index: number) => {
        const card: Card = this._tableModel.drawCard()
        player.addHand(card)

        const deckPosition: { x: number; y: number } = {
          x: this._deckView.x,
          y: this._deckView.y - 2 * 8
        }
        const delay: number =
          i * delayPerCard * this._playerModels.length + index * delayPerCard

        this._playerViews[index].addCardToHand(deckPosition, card, i, delay)
      })
    }
  }

  public addCard(index: number): void {
    const delayPerCard: number = 150

    const card: Card = this._tableModel.drawCard()
    const handLength: number = this._playerModels[index].hand.getCardCount()

    if (!card) {
      throw new Error('Deck is empty.')
    }

    this._playerModels[index].addHand(card)

    const deckPosition: { x: number; y: number } = {
      x: this._deckView.x,
      y: this._deckView.y - 2 * 8
    }
    const delay: number =
      handLength * delayPerCard * this._playerModels.length +
      index * delayPerCard

    this._playerViews[index].addCardToHand(
      deckPosition,
      card,
      handLength,
      delay
    )
  }

  public updateBlackjackPlayerStates(): void {
    this._playerModels.forEach(
      (playerModel: BlackjackPlayer, index: number) => {
        if (playerModel.isBlackjack()) {
          playerModel.status = PlayerStatus.Blackjack //eslint-disable-line
          this._playerViews[index].updateStates()
          this._playerViews[index].changeBlackjackColor()
        }
      }
    )
  }

  public updatePlayersStates(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      playerView.updateStates()
    })
  }

  public updatePlayersScore(): void {
    this._playerViews.forEach((playerView) => {
      playerView.updateScore()
    })
  }

  public revealUserHand(): void {
    this._playerViews.forEach((playerView: PlayerView) => {
      playerView.revealHand()
    })
  }

  // this._playerModels => [player: Player, player: Player, player: Player]

  public aiPlayerProcess(): void {
    this._playerModels.forEach(
      (playerModel: BlackjackPlayer, index: number) => {
        if (playerModel.playerType === PlayerTypes.Ai) {
          while (playerModel.getHandTotalScore() < 17) {
            this.addCard(index)
            playerModel.incrementCurrentTurn()

            if (playerModel.getHandTotalScore() > 21) {
              playerModel.status = PlayerStatus.Bust // eslint-disable-line
              break
            } else if (playerModel.getHandTotalScore() >= 17) {
              playerModel.status = PlayerStatus.Stand // eslint-disable-line
              break
            }
          }
        }
      }
    )
  }

  public startGame(): void {
    this.dealCardAnimation()
    this.aiPlayerProcess()
    this.updateBlackjackPlayerStates()
    this.updatePlayersScore()
    this.revealUserHand()
    // this.aiPlayerProcess()
  }
}
