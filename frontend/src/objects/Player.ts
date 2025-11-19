import Phaser from 'phaser';

/**
 * Player character class
 * Controlled by arrow keys or WASD
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private speed: number = 300;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set up physics properties
    this.setCollideWorldBounds(true);
    this.setScale(1);

    // Initialize input
    this.setupInput();
  }

  private setupInput(): void {
    if (!this.scene.input.keyboard) return;

    // Arrow keys
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // WASD keys
    this.wasd = {
      up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  update(): void {
    if (!this.cursors || !this.wasd) return;

    // Reset velocity
    this.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.setVelocityX(this.speed);
    }

    // Vertical movement
    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.setVelocityY(-this.speed);
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.setVelocityY(this.speed);
    }
  }

  hit(): void {
    // Visual feedback when hit
    this.setTint(0xff0000);
    this.scene.cameras.main.shake(200, 0.01);
  }
}
