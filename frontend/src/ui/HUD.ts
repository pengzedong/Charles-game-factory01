import Phaser from 'phaser';
import { GameState } from '../core/GameState';
import { eventBus, GameEvents } from '../core/Events';

/**
 * Heads-Up Display
 * Shows score, level, and combo information
 */
export class HUD {
  private scene: Phaser.Scene;
  private gameState: GameState;

  private scoreText?: Phaser.GameObjects.Text;
  private levelText?: Phaser.GameObjects.Text;
  private comboText?: Phaser.GameObjects.Text;

  // Store handler references for proper cleanup
  private scoreHandler: (score: number) => void;
  private levelHandler: (level: number) => void;
  private comboHandler: (data: { streak: number; multiplier: number }) => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gameState = GameState.getInstance();

    this.scoreHandler = (score: number) => this.updateScore(score);
    this.levelHandler = (level: number) => this.updateLevel(level);
    this.comboHandler = (data) => this.updateCombo(data.streak, data.multiplier);

    this.create();
    this.setupListeners();
  }

  private create(): void {
    this.scoreText = this.scene.add.text(20, 20, `Score: ${this.gameState.currentScore}`, {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(100);

    this.levelText = this.scene.add.text(20, 60, `Level: ${this.gameState.currentLevel}`, {
      fontSize: '24px',
      color: '#00ff88',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });
    this.levelText.setScrollFactor(0);
    this.levelText.setDepth(100);

    this.comboText = this.scene.add.text(20, 100, '', {
      fontSize: '20px',
      color: '#ffaa00',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });
    this.comboText.setScrollFactor(0);
    this.comboText.setDepth(100);
    this.comboText.setVisible(false);
  }

  private setupListeners(): void {
    eventBus.on(GameEvents.SCORE_CHANGED, this.scoreHandler);
    eventBus.on(GameEvents.LEVEL_CHANGED, this.levelHandler);
    eventBus.on(GameEvents.COMBO_CHANGED, this.comboHandler);
  }

  private updateScore(score: number): void {
    this.scoreText?.setText(`Score: ${score}`);

    this.scene.tweens.add({
      targets: this.scoreText,
      scale: 1.2,
      duration: 100,
      yoyo: true,
    });
  }

  private updateLevel(level: number): void {
    this.levelText?.setText(`Level: ${level}`);

    this.scene.tweens.add({
      targets: this.levelText,
      scale: 1.3,
      duration: 200,
      yoyo: true,
    });
  }

  private updateCombo(streak: number, multiplier: number): void {
    if (multiplier > 1) {
      this.comboText?.setText(`${multiplier}x Combo (${streak})`);
      this.comboText?.setVisible(true);

      this.scene.tweens.add({
        targets: this.comboText,
        scale: 1.3,
        duration: 150,
        yoyo: true,
      });
    } else {
      this.comboText?.setVisible(false);
    }
  }

  destroy(): void {
    eventBus.off(GameEvents.SCORE_CHANGED, this.scoreHandler);
    eventBus.off(GameEvents.LEVEL_CHANGED, this.levelHandler);
    eventBus.off(GameEvents.COMBO_CHANGED, this.comboHandler);
    this.scoreText?.destroy();
    this.levelText?.destroy();
    this.comboText?.destroy();
  }
}
