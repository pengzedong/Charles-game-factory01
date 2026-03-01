import Phaser from 'phaser';

/**
 * Coin/collectible class
 * Falls from the top and can be collected for points - supports object pooling
 */
export class Coin extends Phaser.Physics.Arcade.Sprite {
  private rotationSpeed: number = 3;
  private collected: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, speed: number = 0) {
    super(scene, x, y, 'coin');

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
    this.collected = false;
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).enable = true;
    }
    this.setVelocityY(speed);
    this.setScale(1);
    this.setAlpha(1);
    this.setRotation(0);

    // Squash-and-stretch bob animation
    this.scene.tweens.add({
      targets: this,
      scaleX: 0.85,
      scaleY: 1.15,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  despawn(): void {
    this.setActive(false);
    this.setVisible(false);
    this.collected = false;
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).enable = false;
    }
    this.setVelocity(0);
    this.scene.tweens.killTweensOf(this);
  }

  update(_time: number, delta: number): void {
    if (!this.active) return;

    // Use delta time instead of hardcoded 1/60
    this.rotation += this.rotationSpeed * (delta / 1000);

    if (this.y > this.scene.cameras.main.height + 50) {
      this.despawn();
    }
  }

  collect(): void {
    if (this.collected) return;
    this.collected = true;

    // Disable physics body immediately to prevent double-collection
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).enable = false;
    }

    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      scale: 1.5,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.despawn();
      },
    });
  }
}
