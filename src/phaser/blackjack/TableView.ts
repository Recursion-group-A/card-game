import * as Phaser from 'phaser'
import Table from '@/models/blackjack/BlackjackTable'
import Player from '@/models/blackjack/BlackjackPlayer'
import PlayerView from '@/phaser/blackjack/PlayerView'
import DeckView from '@/phaser/common/DeckView'
import Deck from '@/models/common/Deck'
import Card from '@/models/common/Card'
import PlayerTypes from '@/types/common/player-types'
import BlackjackActions from '@/types/blackjack/action-types'
import { PlayerStatus } from '@/types/blackjack/player-status-types'

export default class TableView extends Phaser.GameObjects.Container {
  private readonly _tableModel: Table

  private readonly _playerModels: Player[]

  private readonly _playerViews: PlayerView[]

  private readonly _deckModel: Deck

  private readonly _deckView: DeckView

  private readonly _actionButtons: Phaser.GameObjects.Container

  private _sceneWidth: number = this.scene.cameras.main.width

  private _sceneHeight: number = this.scene.cameras.main.height

  constructor(scene: Phaser.Scene, tableModel: Table) {
    super(scene)
    this._tableModel = tableModel
    this._playerModels = []
    this._playerViews = []
    this._deckModel = this._tableModel.deck
    this._deckView = this.createDeckView()
    this._actionButtons = this.scene.add.container()

    this.add([this._deckView])

    this._playerModels = this._tableModel.players

    this.createPlayerViews()

    this._deckModel.shuffle()
    scene.add.existing(this)
  }

  private createPlayerViews(): void {
    const playersPos: { x: number; y: number }[] = [
      { x: 750, y: 100 }, // プレイヤー
      { x: 750, y: 350 },
      { x: 450, y: 550 },
      { x: 150, y: 350 },
      { x: 150, y: 100 },
      { x: 450, y: 100 }
    ]

    this._playerModels.forEach((player: Player, index: number) => {
      if (player.playerType === PlayerTypes.Ai) {
        player.decideAiPlayerBetAmount()
      }
      const playerView = new PlayerView(this.scene, player, playersPos[index])
      this._playerViews.push(playerView)
      this.add(playerView)
    })
  }

  private createDeckView(): DeckView {
    return new DeckView(this.scene, this._sceneWidth / 2, this._sceneHeight / 2)
  }

  public dealCardAnimation(): void {
    const delayPerCard: number = 150

    for (let i: number = 0; i < 2; i += 1) {
      this._playerModels.forEach((player: Player, index: number) => {
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
    this._playerModels.forEach((playerModel: Player, index: number) => {
      if (playerModel.isBlackjack()) {
        playerModel.status = PlayerStatus.Blackjack //eslint-disable-line
        this._playerViews[index].updateStates()
        this._playerViews[index].changeBlackjackColor()
      }
    })
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

  public aiPlayerProcess(): void {
    this._playerModels.forEach((playerModel: Player, index: number) => {
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
    })
  }

  public async startGame(): Promise<void> {
    this.dealCardAnimation()
    this.aiPlayerProcess()
    this.updateBlackjackPlayerStates()
    this.updatePlayersScore()
    this.revealUserHand()

    const player: PlayerView = this._playerViews.filter(
      (playerView) => playerView.playerModel.playerType === PlayerTypes.Player
    )[0]

    this.displayActionButtons(player)

    const action: BlackjackActions | undefined = await this.getUserAction()
    console.log(action)
  }

  public async getUserAction(): Promise<BlackjackActions> {
    return new Promise((resolve) => {
      this._actionButtons.each((child: Phaser.GameObjects.Container) => {
        child.list[0].on('pointerdown', () => {
          resolve(child.list[1].name as BlackjackActions)
        })
      })
    })
  }

  public displayActionButtons(player: PlayerView): void {
    const offset: number = 120
    const wspace: number = 120
    const hspace: number = 180

    // ボタン表示の条件分岐

    this.createButton(
      player.x - offset,
      player.y + hspace,
      BlackjackActions.Hit
    )
    this.createButton(
      player.x + wspace - offset,
      player.y + hspace,
      BlackjackActions.Stand
    )
    this.createButton(
      player.x + wspace * 2 - offset,
      player.y + hspace,
      BlackjackActions.Double
    )
    this.createButton(
      player.x + wspace * 3 - offset,
      player.y + hspace,
      BlackjackActions.Surrender
    )

    this.setVisibleActionButtons(true)
  }

  public setVisibleActionButtons(bool: boolean) {
    this._actionButtons.setVisible(bool)
  }

  private createButton(x: number, y: number, textContent: string): void {
    const container: Phaser.GameObjects.Container = this.scene.add.container()
    const button: Phaser.GameObjects.Image = this.scene.add
      .image(x, y, 'btn-dark')
      .setScale(1.3, 0.8)
      .setInteractive({ useHandCursor: true })
    const text: Phaser.GameObjects.Text = this.scene.add.text(
      x,
      y,
      textContent.toUpperCase(),
      { font: '16px' }
    )
    text.setOrigin(0.5, 0.5)
    text.setName(textContent)

    container.add([button, text])
    this._actionButtons.add(container)

    button.on('pointerover', () => {
      button.setScale(1.4, 0.9)
    })
    button.on('pointerout', () => {
      button.setScale(1.3, 0.8)
    })
  }

  get playerViews(): PlayerView[] {
    return this._playerViews
  }
}
