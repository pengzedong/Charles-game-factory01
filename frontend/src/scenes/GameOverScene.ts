import Phaser from 'phaser';
import { GameState } from '../core/GameState';

/**
 * Game over scene
 * Displays final score, best score, and restart option
 */
export class GameOverScene extends Phaser.Scene {
  private gameState: GameState;
  private restartKey?: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'GameOverScene' });
    this.gameState = GameState.getInstance();
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    const bg = this.add.rectangle(0, 0, width, height, 0x1a1a2e);
    bg.setOrigin(0, 0);

    // Game Over title
    const gameOverText = this.add.text(width / 2, height * 0.25, 'GAME OVER', {
      fontSize: '64px',
      color: '#ff4444',
      fontStyle: 'bold',
    });
    gameOverText.setOrigin(0.5);

    // Final score
    const scoreText = this.add.text(
      width / 2,
      height * 0.4,
      `Score: ${this.gameState.currentScore}`,
      {
        fontSize: '36px',
        color: '#ffffff',
      }
    );
    scoreText.setOrigin(0.5);

    // Level reached
    const levelText = this.add.text(
      width / 2,
      height * 0.5,
      `Level Reached: ${this.gameState.currentLevel}`,
      {
        fontSize: '28px',
        color: '#aaaaaa',
      }
    );
    levelText.setOrigin(0.5);

    // Best score
    const isNewRecord = this.gameState.currentScore === this.gameState.bestScore && this.gameState.currentScore > 0;
    const bestScoreColor = isNewRecord ? '#00ff88' : '#ffaa00';
    const bestScoreLabel = isNewRecord ? 'NEW BEST SCORE!' : 'Best Score';

    const bestScoreText = this.add.text(
      width / 2,
      height * 0.65,
      `${bestScoreLabel}: ${this.gameState.bestScore}`,
      {
        fontSize: '32px',
        color: bestScoreColor,
      }
    );
    bestScoreText.setOrigin(0.5);

    if (isNewRecord) {
      // Animate new record
      this.tweens.add({
        targets: bestScoreText,
        scale: 1.1,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    }

    // Restart prompt
    const restartText = this.add.text(
      width / 2,
      height * 0.85,
      'Press ENTER to Restart\nPress M for Menu',
      {
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
      }
    );
    restartText.setOrigin(0.5);

    // Blinking animation
    this.tweens.add({
      targets: restartText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Input
    this.restartKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const menuKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.M);

    // Handle menu key
    menuKey?.on('down', () => {
      this.scene.start('MenuScene');
    });

    // Also allow clicking to restart
    this.input.on('pointerdown', () => {
      this.restartGame();
    });
  }

  update(): void {
    if (this.restartKey?.isDown) {
      this.restartGame();
    }
  }

  private restartGame(): void {
    this.scene.start('GameScene');
  }
}
