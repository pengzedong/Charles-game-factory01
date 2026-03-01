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

    this.setCollideWorldBounds(true);
    this.setScale(1);

    this.setupInput();
  }

  private setupInput(): void {
    if (!this.scene.input.keyboard) return;

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.wasd = {
      up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  update(): void {
    if (!this.cursors || !this.wasd) return;

    let vx = 0;
    let vy = 0;

    // Horizontal movement
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      vx = -1;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      vx = 1;
    }

    // Vertical movement
    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      vy = -1;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      vy = 1;
    }

    // Normalize diagonal movement so it's not 41% faster
    if (vx !== 0 && vy !== 0) {
      const factor = Math.SQRT1_2; // 1/sqrt(2)
      vx *= factor;
      vy *= factor;
    }

    this.setVelocity(vx * this.speed, vy * this.speed);

    // Tilt when moving horizontally
    this.setRotation(vx * 0.15);
  }

  hit(): void {
    // White flash then red tint, auto-clear
    this.setTint(0xffffff);
    this.scene.time.delayedCall(80, () => {
      this.setTint(0xff0000);
      this.scene.time.delayedCall(400, () => {
        this.clearTint();
      });
    });

    this.scene.cameras.main.shake(300, 0.03);
    this.scene.cameras.main.flash(150, 255, 50, 50);
  }
}
