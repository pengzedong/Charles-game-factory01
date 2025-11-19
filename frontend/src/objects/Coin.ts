import Phaser from 'phaser';

/**
 * Coin/collectible class
 * Falls from the top and can be collected for points
 */
export class Coin extends Phaser.Physics.Arcade.Sprite {
  private rotationSpeed: number = 3;

  constructor(scene: Phaser.Scene, x: number, y: number, speed: number) {
    super(scene, x, y, 'coin');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set velocity to fall down
    this.setVelocityY(speed);
    this.setScale(1);
  }

  update(): void {
    // Rotate for visual effect
    this.rotation += this.rotationSpeed * (1 / 60);

    // Destroy if off screen
    if (this.y > this.scene.cameras.main.height + 50) {
      this.destroy();
    }
  }

  collect(): void {
    // Play a simple scale animation when collected
    this.scene.tweens.add({
      targets: this,
      scale: 1.5,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.destroy();
      },
    });
  }
}
