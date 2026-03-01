import Phaser from 'phaser';
import { GameState } from '../core/GameState';

/**
 * Main menu scene
 * Displays title, instructions, and high score
 */
export class MenuScene extends Phaser.Scene {
  private gameState: GameState;
  private started: boolean = false;

  constructor() {
    super({ key: 'MenuScene' });
    this.gameState = GameState.getInstance();
  }

  create(): void {
    this.started = false;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    const bg = this.add.rectangle(0, 0, width, height, 0x1a1a2e);
    bg.setOrigin(0, 0);

    // Scrolling stars background
    for (let i = 0; i < 50; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 2),
        0xffffff,
        Phaser.Math.FloatBetween(0.2, 0.7)
      );
      this.tweens.add({
        targets: star,
        y: height + 10,
        duration: Phaser.Math.Between(3000, 8000),
        repeat: -1,
        onRepeat: () => {
          star.x = Phaser.Math.Between(0, width);
          star.y = -10;
        },
      });
    }

    // Title
    const title = this.add.text(width / 2, height * 0.2, 'KEY DASH\nADVENTURE', {
      fontSize: '64px',
      color: '#00ff88',
      align: 'center',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // Title glow animation
    this.tweens.add({
      targets: title,
      alpha: 0.7,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Instructions
    const instructions = this.add.text(
      width / 2,
      height * 0.45,
      'Use ARROW KEYS or WASD to move\n\n' +
      'Avoid red obstacles\n' +
      'Collect yellow coins\n' +
      'Build combos for multipliers!\n\n' +
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
      height * 0.72,
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
      'Press ENTER or Click to Start',
      {
        fontSize: '24px',
        color: '#00ff88',
      }
    );
    startText.setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Input
    this.input.on('pointerdown', () => {
      this.startGame();
    });
  }

  update(): void {
    const enterKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    if (enterKey && Phaser.Input.Keyboard.JustDown(enterKey)) {
      this.startGame();
    }
  }

  private startGame(): void {
    if (this.started) return;
    this.started = true;

    try {
      this.sound.play('start', { volume: 0.5 });
    } catch {
      // Audio may not be available
    }

    this.scene.start('GameScene');
  }
}
