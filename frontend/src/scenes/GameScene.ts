import Phaser from 'phaser';
import { Player } from '../objects/Player';
import { Obstacle } from '../objects/Obstacle';
import { Coin } from '../objects/Coin';
import { HUD } from '../ui/HUD';
import { GameState } from '../core/GameState';
import { getLevelConfig, getLevelForScore } from '../config/levels';
import { eventBus, GameEvents } from '../core/Events';

/**
 * Main gameplay scene
 */
export class GameScene extends Phaser.Scene {
  private player?: Player;
  private obstacles?: Phaser.GameObjects.Group;
  private coins?: Phaser.GameObjects.Group;
  private hud?: HUD;
  private gameState: GameState;

  private obstacleTimer?: Phaser.Time.TimerEvent;
  private coinTimer?: Phaser.Time.TimerEvent;

  private pauseKey?: Phaser.Input.Keyboard.Key;
  private pauseKey2?: Phaser.Input.Keyboard.Key;
  private pauseText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
    this.gameState = GameState.getInstance();
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Reset game state
    this.gameState.reset();

    // Background
    const bg = this.add.rectangle(0, 0, width, height, 0x0f0f1e);
    bg.setOrigin(0, 0);

    // Create player
    this.player = new Player(this, width / 2, height - 100);

    // Create groups
    this.obstacles = this.add.group({
      classType: Obstacle,
      runChildUpdate: true,
    });

    this.coins = this.add.group({
      classType: Coin,
      runChildUpdate: true,
    });

    // Set up collisions
    this.physics.add.overlap(
      this.player,
      this.obstacles,
      this.handleObstacleCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.handleCoinCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Create HUD
    this.hud = new HUD(this);

    // Set up spawning
    this.setupSpawning();

    // Pause functionality
    this.pauseKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.pauseKey2 = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Pause text (hidden by default)
    this.pauseText = this.add.text(width / 2, height / 2, 'PAUSED\n\nPress P or ESC to resume', {
      fontSize: '48px',
      color: '#ffffff',
      align: 'center',
      backgroundColor: '#000000',
      padding: { x: 20, y: 20 },
    });
    this.pauseText.setOrigin(0.5);
    this.pauseText.setVisible(false);

    // Listen to score changes to check for level advancement
    eventBus.on(GameEvents.SCORE_CHANGED, this.checkLevelAdvancement.bind(this));
  }

  update(): void {
    // Check for pause toggle
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey!) || Phaser.Input.Keyboard.JustDown(this.pauseKey2!)) {
      this.togglePause();
    }

    // If paused, don't update game logic
    if (this.gameState.isPaused) {
      return;
    }

    // Update player
    this.player?.update();
  }

  private setupSpawning(): void {
    const config = getLevelConfig(this.gameState.currentLevel);

    // Spawn obstacles
    this.obstacleTimer = this.time.addEvent({
      delay: config.obstacleSpawnInterval,
      callback: () => this.spawnObstacle(config.obstacleSpeed, config.obstacleSpawnChance),
      loop: true,
    });

    // Spawn coins
    this.coinTimer = this.time.addEvent({
      delay: config.coinSpawnInterval,
      callback: () => this.spawnCoin(config.coinSpeed, config.coinSpawnChance),
      loop: true,
    });
  }

  private spawnObstacle(speed: number, chance: number): void {
    if (this.gameState.isPaused) return;
    if (Math.random() > chance) return;

    const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
    const obstacle = new Obstacle(this, x, -50, speed);
    this.obstacles?.add(obstacle);
  }

  private spawnCoin(speed: number, chance: number): void {
    if (this.gameState.isPaused) return;
    if (Math.random() > chance) return;

    const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
    const coin = new Coin(this, x, -50, speed);
    this.coins?.add(coin);
  }

  private handleObstacleCollision(
    player: Phaser.GameObjects.GameObject,
    obstacle: Phaser.GameObjects.GameObject
  ): void {
    // Play hit sound
    this.sound.play('hit', { volume: 0.6 });

    // Player hit animation
    (player as Player).hit();

    // Game over
    this.gameState.gameOver();

    // Transition to game over scene
    this.time.delayedCall(500, () => {
      this.scene.start('GameOverScene');
    });
  }

  private handleCoinCollision(
    player: Phaser.GameObjects.GameObject,
    coin: Phaser.GameObjects.GameObject
  ): void {
    // Play coin sound
    this.sound.play('coin', { volume: 0.4 });

    // Collect coin
    (coin as Coin).collect();

    // Add score
    this.gameState.addScore(10);

    // Emit event
    eventBus.emit(GameEvents.COIN_COLLECTED);
  }

  private checkLevelAdvancement(): void {
    const currentScore = this.gameState.currentScore;
    const expectedLevel = getLevelForScore(currentScore);

    if (expectedLevel > this.gameState.currentLevel) {
      this.advanceLevel(expectedLevel);
    }
  }

  private advanceLevel(newLevel: number): void {
    this.gameState.setLevel(newLevel);

    // Update spawning timers with new config
    const config = getLevelConfig(newLevel);

    this.obstacleTimer?.remove();
    this.coinTimer?.remove();

    this.obstacleTimer = this.time.addEvent({
      delay: config.obstacleSpawnInterval,
      callback: () => this.spawnObstacle(config.obstacleSpeed, config.obstacleSpawnChance),
      loop: true,
    });

    this.coinTimer = this.time.addEvent({
      delay: config.coinSpawnInterval,
      callback: () => this.spawnCoin(config.coinSpeed, config.coinSpawnChance),
      loop: true,
    });

    // Visual feedback
    const levelUpText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      `LEVEL ${newLevel}`,
      {
        fontSize: '64px',
        color: '#00ff88',
      }
    );
    levelUpText.setOrigin(0.5);

    this.tweens.add({
      targets: levelUpText,
      alpha: 0,
      scale: 2,
      duration: 1500,
      onComplete: () => {
        levelUpText.destroy();
      },
    });
  }

  private togglePause(): void {
    this.gameState.togglePause();

    if (this.gameState.isPaused) {
      this.physics.pause();
      this.pauseText?.setVisible(true);
    } else {
      this.physics.resume();
      this.pauseText?.setVisible(false);
    }
  }

  shutdown(): void {
    // Clean up event listeners
    eventBus.off(GameEvents.SCORE_CHANGED, this.checkLevelAdvancement.bind(this));
  }
}
