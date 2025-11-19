import Phaser from 'phaser';

/**
 * Obstacle class
 * Falls from the top of the screen
 */
export class Obstacle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, speed: number) {
    super(scene, x, y, 'obstacle');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set velocity to fall down
    this.setVelocityY(speed);
    this.setScale(1);
  }

  update(): void {
    // Destroy if off screen
    if (this.y > this.scene.cameras.main.height + 50) {
      this.destroy();
    }
  }
}
