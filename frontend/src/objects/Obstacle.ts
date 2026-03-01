import Phaser from 'phaser';

/**
 * Obstacle class
 * Falls from the top of the screen - supports object pooling
 */
export class Obstacle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, speed: number = 0) {
    super(scene, x, y, 'obstacle');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (speed > 0) {
      this.spawn(x, y, speed);
    }
  }

  spawn(x: number, y: number, speed: number): void {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).enable = true;
    }
    this.setVelocityY(speed);
    this.setScale(1);
    this.setAlpha(1);
  }

  despawn(): void {
    this.setActive(false);
    this.setVisible(false);
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).enable = false;
    }
    this.setVelocity(0);
  }

  update(): void {
    if (!this.active) return;

    if (this.y > this.scene.cameras.main.height + 50) {
      this.despawn();
    }
  }
}
