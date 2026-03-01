import Phaser from 'phaser';
import { Player } from '../objects/Player';
import { Obstacle } from '../objects/Obstacle';
import { Coin } from '../objects/Coin';
import { HUD } from '../ui/HUD';
import { GameState } from '../core/GameState';
import { getLevelConfig, getLevelForScore } from '../config/levels';
import { eventBus, GameEvents } from '../core/Events';

const NEAR_MISS_DISTANCE = 50;
const WARM_UP_MS = 3000;
const WAVE_MIN_INTERVAL = 12000;
const WAVE_MAX_INTERVAL = 18000;

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
  private waveTimer?: Phaser.Time.TimerEvent;

  private pauseKey?: Phaser.Input.Keyboard.Key;
  private pauseKey2?: Phaser.Input.Keyboard.Key;
  private pauseText?: Phaser.GameObjects.Text;
  private scoreChangedHandler: () => void;

  private warmUpActive: boolean = true;

  // Background stars
  private bgStars: Phaser.GameObjects.Arc[] = [];

  constructor() {
    super({ key: 'GameScene' });
    this.gameState = GameState.getInstance();
    this.scoreChangedHandler = this.checkLevelAdvancement.bind(this);
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Reset game state
    this.gameState.reset();
    this.warmUpActive = true;

    // Background
    const bg = this.add.rectangle(0, 0, width, height, 0x0f0f1e);
    bg.setOrigin(0, 0);

    // Scrolling stars for motion effect
    this.bgStars = [];
    for (let i = 0; i < 30; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 2),
        0xffffff,
        Phaser.Math.FloatBetween(0.1, 0.4)
      );
      star.setDepth(0);
      this.bgStars.push(star);
    }

    // Create player
    this.player = new Player(this, width / 2, height - 100);

    // Create groups for pooling
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
      (_player, obstacle) => (obstacle as Obstacle).active,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.handleCoinCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      (_player, coin) => (coin as Coin).active,
      this
    );

    // Create HUD
    this.hud = new HUD(this);

    // Set up spawning (coins only during warm-up)
    this.setupSpawning();

    // Schedule obstacle spawning after warm-up
    this.time.delayedCall(WARM_UP_MS, () => {
      this.warmUpActive = false;
      this.restartObstacleTimer();
    });

    // Wave events
    this.scheduleWaveEvent();

    // Pause functionality
    this.pauseKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.pauseKey2 = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.pauseText = this.add.text(width / 2, height / 2, 'PAUSED\n\nPress P or ESC to resume', {
      fontSize: '48px',
      color: '#ffffff',
      align: 'center',
      backgroundColor: '#000000',
      padding: { x: 20, y: 20 },
    });
    this.pauseText.setOrigin(0.5);
    this.pauseText.setVisible(false);
    this.pauseText.setDepth(200);

    // Warm-up text
    const warmUpText = this.add.text(width / 2, height / 2 - 50, 'GET READY!', {
      fontSize: '48px',
      color: '#00ff88',
    });
    warmUpText.setOrigin(0.5);
    warmUpText.setDepth(150);

    this.tweens.add({
      targets: warmUpText,
      alpha: 0,
      scale: 2,
      duration: 2000,
      onComplete: () => warmUpText.destroy(),
    });

    eventBus.on(GameEvents.SCORE_CHANGED, this.scoreChangedHandler);
  }

  update(): void {
    // Check for pause toggle
    if ((this.pauseKey && Phaser.Input.Keyboard.JustDown(this.pauseKey)) ||
        (this.pauseKey2 && Phaser.Input.Keyboard.JustDown(this.pauseKey2))) {
      this.togglePause();
    }

    if (this.gameState.isPaused) {
      return;
    }

    this.player?.update();

    // Scroll background stars
    const height = this.cameras.main.height;
    const width = this.cameras.main.width;
    for (const star of this.bgStars) {
      star.y += 0.5;
      if (star.y > height + 5) {
        star.y = -5;
        star.x = Phaser.Math.Between(0, width);
      }
    }

    // Near-miss detection
    this.checkNearMisses();
  }

  private setupSpawning(): void {
    const config = getLevelConfig(this.gameState.currentLevel);

    // Spawn coins immediately
    this.coinTimer = this.time.addEvent({
      delay: config.coinSpawnInterval,
      callback: () => this.spawnCoin(config.coinSpeed, config.coinSpawnChance),
      loop: true,
    });
  }

  private restartObstacleTimer(): void {
    this.obstacleTimer?.remove();
    const config = getLevelConfig(this.gameState.currentLevel);
    this.obstacleTimer = this.time.addEvent({
      delay: config.obstacleSpawnInterval,
      callback: () => this.spawnObstacle(config.obstacleSpeed, config.obstacleSpawnChance),
      loop: true,
    });
  }

  private spawnObstacle(speed: number, chance: number): void {
    if (this.gameState.isPaused || this.warmUpActive) return;
    if (Math.random() > chance) return;

    const x = Phaser.Math.Between(50, this.cameras.main.width - 50);

    // Try to reuse from pool
    const existing = this.obstacles?.getFirstDead() as Obstacle | null;
    if (existing) {
      existing.spawn(x, -50, speed);
    } else {
      const obstacle = new Obstacle(this, x, -50, speed);
      this.obstacles?.add(obstacle);
    }
  }

  private spawnCoin(speed: number, chance: number): void {
    if (this.gameState.isPaused) return;
    if (Math.random() > chance) return;

    const x = Phaser.Math.Between(50, this.cameras.main.width - 50);

    const existing = this.coins?.getFirstDead() as Coin | null;
    if (existing) {
      existing.spawn(x, -50, speed);
    } else {
      const coin = new Coin(this, x, -50, speed);
      this.coins?.add(coin);
    }
  }

  private handleObstacleCollision(
    player: Phaser.GameObjects.GameObject,
    obstacle: Phaser.GameObjects.GameObject
  ): void {
    try {
      this.sound.play('hit', { volume: 0.6 });
    } catch { /* audio may not be available */ }

    (player as Player).hit();
    (obstacle as Obstacle).despawn();

    // Reset combo
    this.gameState.resetCombo();

    // Death particles
    this.spawnParticles(
      (player as Player).x,
      (player as Player).y,
      0xff4444,
      20
    );

    // Hit freeze frame
    this.physics.pause();
    this.time.delayedCall(80, () => {
      this.physics.resume();
    });

    this.gameState.gameOver();

    try {
      this.sound.play('gameover', { volume: 0.5 });
    } catch { /* audio may not be available */ }

    this.time.delayedCall(600, () => {
      this.scene.start('GameOverScene');
    });
  }

  private handleCoinCollision(
    player: Phaser.GameObjects.GameObject,
    coin: Phaser.GameObjects.GameObject
  ): void {
    const typedCoin = coin as Coin;
    if (!typedCoin.active) return;

    try {
      this.sound.play('coin', {
        volume: 0.4,
        rate: Phaser.Math.FloatBetween(0.9, 1.1),
      });
    } catch { /* audio may not be available */ }

    const coinX = typedCoin.x;
    const coinY = typedCoin.y;

    typedCoin.collect();

    // Coin particles
    this.spawnParticles(coinX, coinY, 0xffcc00, 12);

    // Increment combo before adding score (multiplier applies)
    this.gameState.incrementCombo();

    // Add score
    const basePoints = 10;
    const actualPoints = Math.floor(basePoints * this.gameState.comboMultiplier);
    this.gameState.addScore(basePoints);

    // Floating score text
    const scoreLabel = this.gameState.comboMultiplier > 1
      ? `+${actualPoints} (${this.gameState.comboMultiplier}x)`
      : `+${actualPoints}`;

    this.showFloatingText(coinX, coinY, scoreLabel, '#ffcc00');

    // Brief glow on the player
    const typedPlayer = player as Player;
    typedPlayer.setTint(0xffff99);
    this.time.delayedCall(120, () => typedPlayer.clearTint());

    eventBus.emit(GameEvents.COIN_COLLECTED);
  }

  private checkNearMisses(): void {
    if (!this.player || !this.obstacles) return;

    const playerX = this.player.x;
    const playerY = this.player.y;

    this.obstacles.getChildren().forEach((obj) => {
      const obstacle = obj as Obstacle;
      if (!obstacle.active) return;

      const dist = Phaser.Math.Distance.Between(playerX, playerY, obstacle.x, obstacle.y);

      if (dist < NEAR_MISS_DISTANCE && dist > 20 && obstacle.y > playerY - 10) {
        if (!(obstacle as any)._nearMissed) {
          (obstacle as any)._nearMissed = true;

          this.gameState.addScore(5);
          this.showFloatingText(playerX, playerY - 30, '+5 CLOSE!', '#ff88ff');
          eventBus.emit(GameEvents.NEAR_MISS);

          this.spawnParticles(playerX, playerY, 0xff88ff, 5);
        }
      }
    });
  }

  private spawnParticles(x: number, y: number, color: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const particle = this.add.circle(
        x,
        y,
        Phaser.Math.Between(2, 4),
        color,
        1
      );
      particle.setDepth(90);

      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-60, 60),
        y: y + Phaser.Math.Between(-60, 60),
        alpha: 0,
        scale: 0,
        duration: Phaser.Math.Between(300, 600),
        onComplete: () => particle.destroy(),
      });
    }
  }

  private showFloatingText(x: number, y: number, text: string, color: string): void {
    const floater = this.add.text(x, y, text, {
      fontSize: '20px',
      color: color,
      fontStyle: 'bold',
    });
    floater.setOrigin(0.5);
    floater.setDepth(110);

    this.tweens.add({
      targets: floater,
      y: y - 60,
      alpha: 0,
      duration: 800,
      onComplete: () => floater.destroy(),
    });
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
    this.cameras.main.flash(200, 0, 255, 100);

    const levelUpText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      `LEVEL ${newLevel}`,
      {
        fontSize: '64px',
        color: '#00ff88',
        fontStyle: 'bold',
      }
    );
    levelUpText.setOrigin(0.5);
    levelUpText.setDepth(150);

    this.tweens.add({
      targets: levelUpText,
      alpha: 0,
      scale: 2,
      duration: 1500,
      onComplete: () => levelUpText.destroy(),
    });
  }

  private scheduleWaveEvent(): void {
    const delay = Phaser.Math.Between(WAVE_MIN_INTERVAL, WAVE_MAX_INTERVAL);
    this.waveTimer = this.time.delayedCall(delay, () => {
      if (!this.gameState.isPaused && !this.warmUpActive) {
        this.triggerWaveEvent();
      }
      this.scheduleWaveEvent();
    });
  }

  private triggerWaveEvent(): void {
    const config = getLevelConfig(this.gameState.currentLevel);
    const width = this.cameras.main.width;

    if (Math.random() < 0.5) {
      // Coin Rain
      this.showFloatingText(width / 2, 100, 'COIN RAIN!', '#ffcc00');
      for (let i = 0; i < 5; i++) {
        this.time.delayedCall(i * 200, () => {
          const x = Phaser.Math.Between(80, width - 80);
          const coin = new Coin(this, x, -50, config.coinSpeed * 0.8);
          this.coins?.add(coin);
        });
      }
    } else {
      // Obstacle Wave
      this.showFloatingText(width / 2, 100, 'INCOMING!', '#ff4444');
      const spacing = (width - 100) / 4;
      for (let i = 0; i < 3; i++) {
        this.time.delayedCall(i * 300, () => {
          const x = 50 + spacing * (i + 1);
          const obstacle = new Obstacle(this, x, -50, config.obstacleSpeed * 0.9);
          this.obstacles?.add(obstacle);
        });
      }
    }
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
    eventBus.off(GameEvents.SCORE_CHANGED, this.scoreChangedHandler);
    this.hud?.destroy();
    this.hud = undefined;
    this.obstacleTimer?.remove();
    this.coinTimer?.remove();
    this.waveTimer?.remove();
    this.bgStars = [];
  }
}
