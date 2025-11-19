import Phaser from 'phaser';
import { GameState } from '../core/GameState';
import { eventBus, GameEvents } from '../core/Events';

/**
 * Heads-Up Display
 * Shows score and level information
 */
export class HUD {
  private scene: Phaser.Scene;
  private gameState: GameState;

  private scoreText?: Phaser.GameObjects.Text;
  private levelText?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gameState = GameState.getInstance();

    this.create();
    this.setupListeners();
  }

  private create(): void {
    // Score display
    this.scoreText = this.scene.add.text(20, 20, `Score: ${this.gameState.currentScore}`, {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(100);

    // Level display
    this.levelText = this.scene.add.text(20, 60, `Level: ${this.gameState.currentLevel}`, {
      fontSize: '24px',
      color: '#00ff88',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });
    this.levelText.setScrollFactor(0);
    this.levelText.setDepth(100);
  }

  private setupListeners(): void {
    // Update score when it changes
    eventBus.on(GameEvents.SCORE_CHANGED, (score: number) => {
      this.updateScore(score);
    });

    // Update level when it changes
    eventBus.on(GameEvents.LEVEL_CHANGED, (level: number) => {
      this.updateLevel(level);
    });
  }

  private updateScore(score: number): void {
    this.scoreText?.setText(`Score: ${score}`);

    // Brief scale animation
    this.scene.tweens.add({
      targets: this.scoreText,
      scale: 1.2,
      duration: 100,
      yoyo: true,
    });
  }

  private updateLevel(level: number): void {
    this.levelText?.setText(`Level: ${level}`);

    // Flash animation
    this.scene.tweens.add({
      targets: this.levelText,
      scale: 1.3,
      duration: 200,
      yoyo: true,
    });
  }

  destroy(): void {
    this.scoreText?.destroy();
    this.levelText?.destroy();
  }
}
