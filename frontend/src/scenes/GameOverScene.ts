import Phaser from 'phaser';
import { GameState } from '../core/GameState';
import { fetchHighscores, submitHighscore } from '../services/api';

/**
 * Game over scene
 * Displays final score, best score, leaderboard, and restart option
 */
export class GameOverScene extends Phaser.Scene {
  private gameState: GameState;
  private started: boolean = false;

  constructor() {
    super({ key: 'GameOverScene' });
    this.gameState = GameState.getInstance();
  }

  create(): void {
    this.started = false;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    const bg = this.add.rectangle(0, 0, width, height, 0x1a1a2e);
    bg.setOrigin(0, 0);

    // Game Over title
    const gameOverText = this.add.text(width / 2, height * 0.12, 'GAME OVER', {
      fontSize: '64px',
      color: '#ff4444',
      fontStyle: 'bold',
    });
    gameOverText.setOrigin(0.5);

    // Animate title in
    this.tweens.add({
      targets: gameOverText,
      scale: { from: 2, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 500,
      ease: 'Back.easeOut',
    });

    // Final score
    const scoreText = this.add.text(
      width / 2,
      height * 0.25,
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
      height * 0.33,
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
      height * 0.43,
      `${bestScoreLabel}: ${this.gameState.bestScore}`,
      {
        fontSize: '32px',
        color: bestScoreColor,
      }
    );
    bestScoreText.setOrigin(0.5);

    if (isNewRecord) {
      this.tweens.add({
        targets: bestScoreText,
        scale: 1.1,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    }

    // Leaderboard area
    const leaderboardTitle = this.add.text(
      width / 2,
      height * 0.53,
      'Global Top 5',
      {
        fontSize: '22px',
        color: '#888888',
      }
    );
    leaderboardTitle.setOrigin(0.5);

    const leaderboardText = this.add.text(
      width / 2,
      height * 0.58,
      'Loading...',
      {
        fontSize: '18px',
        color: '#cccccc',
        align: 'center',
        lineSpacing: 6,
      }
    );
    leaderboardText.setOrigin(0.5, 0);

    // Submit score and fetch leaderboard (non-blocking)
    this.loadLeaderboard(leaderboardText);

    // Restart prompt
    const restartText = this.add.text(
      width / 2,
      height * 0.88,
      'Press ENTER to Restart\nPress M for Menu',
      {
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
      }
    );
    restartText.setOrigin(0.5);

    this.tweens.add({
      targets: restartText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Input
    const menuKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    menuKey?.on('down', () => {
      if (this.started) return;
      this.started = true;
      this.scene.start('MenuScene');
    });

    this.input.on('pointerdown', () => {
      this.restartGame();
    });
  }

  update(): void {
    const enterKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    if (enterKey && Phaser.Input.Keyboard.JustDown(enterKey)) {
      this.restartGame();
    }
  }

  private restartGame(): void {
    if (this.started) return;
    this.started = true;
    this.scene.start('GameScene');
  }

  private async loadLeaderboard(leaderboardText: Phaser.GameObjects.Text): Promise<void> {
    try {
      if (this.gameState.currentScore > 0) {
        await submitHighscore(this.gameState.currentScore);
      }
    } catch {
      // Non-blocking
    }

    try {
      const scores = await fetchHighscores(5);
      if (scores.length > 0) {
        const lines = scores.map(
          (entry, i) => `${i + 1}. ${entry.playerName} - ${entry.score}`
        );
        leaderboardText.setText(lines.join('\n'));
      } else {
        leaderboardText.setText('No scores yet');
      }
    } catch {
      leaderboardText.setText('Offline mode');
    }
  }
}
