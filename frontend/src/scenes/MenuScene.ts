import Phaser from 'phaser';
import { GameState } from '../core/GameState';

/**
 * Main menu scene
 * Displays title, instructions, and high score
 */
export class MenuScene extends Phaser.Scene {
  private gameState: GameState;
  private startKey?: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'MenuScene' });
    this.gameState = GameState.getInstance();
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    const bg = this.add.rectangle(0, 0, width, height, 0x1a1a2e);
    bg.setOrigin(0, 0);

    // Title
    const title = this.add.text(width / 2, height * 0.2, 'KEY DASH\nADVENTURE', {
      fontSize: '64px',
      color: '#00ff88',
      align: 'center',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // Instructions
    const instructions = this.add.text(
      width / 2,
      height * 0.45,
      'Use ARROW KEYS or WASD to move\n\n' +
      'Avoid red obstacles\n' +
      'Collect yellow coins\n\n' +
      'Press P or ESC to pause',
      {
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 8,
      }
    );
    instructions.setOrigin(0.5);

    // High score
    const bestScore = this.gameState.bestScore;
    const highScoreText = this.add.text(
      width / 2,
      height * 0.7,
      `Best Score: ${bestScore}`,
      {
        fontSize: '28px',
        color: '#ffaa00',
      }
    );
    highScoreText.setOrigin(0.5);

    // Start prompt
    const startText = this.add.text(
      width / 2,
      height * 0.85,
      'Press ENTER to Start',
      {
        fontSize: '24px',
        color: '#00ff88',
      }
    );
    startText.setOrigin(0.5);

    // Blinking animation for start text
    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Input
    this.startKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Also allow clicking anywhere to start
    this.input.on('pointerdown', () => {
      this.startGame();
    });
  }

  update(): void {
    if (this.startKey?.isDown) {
      this.startGame();
    }
  }

  private startGame(): void {
    // Play start sound
    this.sound.play('start', { volume: 0.5 });

    // Start the game scene
    this.scene.start('GameScene');
  }
}
