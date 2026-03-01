import Phaser from 'phaser';

/**
 * Boot scene - generates fallback assets and preloads real assets if available
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '32px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5);

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2, 320, 50);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 + 10, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Generate fallback textures programmatically
    this.generateTextures();

    // Try loading real assets - they'll override the generated ones if they exist
    this.load.image('player', 'assets/images/player.png');
    this.load.image('obstacle', 'assets/images/obstacle.png');
    this.load.image('coin', 'assets/images/coin.png');

    this.load.audio('coin_sfx', 'assets/audio/coin.wav');
    this.load.audio('hit_sfx', 'assets/audio/hit.wav');
    this.load.audio('start_sfx', 'assets/audio/start.wav');

    // Silently handle load errors - fallback textures are already generated
    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.warn(`Asset not found, using fallback: ${file.key}`);
    });
  }

  private generateTextures(): void {
    // Player: green rounded square
    const playerGfx = this.make.graphics({ x: 0, y: 0 });
    playerGfx.fillStyle(0x00cc66, 1);
    playerGfx.fillRoundedRect(0, 0, 32, 32, 6);
    playerGfx.lineStyle(2, 0x00ff88, 1);
    playerGfx.strokeRoundedRect(0, 0, 32, 32, 6);
    // Eyes
    playerGfx.fillStyle(0xffffff, 1);
    playerGfx.fillCircle(11, 12, 4);
    playerGfx.fillCircle(21, 12, 4);
    playerGfx.fillStyle(0x000000, 1);
    playerGfx.fillCircle(12, 12, 2);
    playerGfx.fillCircle(22, 12, 2);
    playerGfx.generateTexture('player', 32, 32);
    playerGfx.destroy();

    // Obstacle: red square with X pattern
    const obstacleGfx = this.make.graphics({ x: 0, y: 0 });
    obstacleGfx.fillStyle(0xcc2222, 1);
    obstacleGfx.fillRect(0, 0, 32, 32);
    obstacleGfx.lineStyle(2, 0xff4444, 1);
    obstacleGfx.strokeRect(0, 0, 32, 32);
    obstacleGfx.lineStyle(2, 0xff6666, 0.6);
    obstacleGfx.lineBetween(4, 4, 28, 28);
    obstacleGfx.lineBetween(28, 4, 4, 28);
    obstacleGfx.generateTexture('obstacle', 32, 32);
    obstacleGfx.destroy();

    // Coin: yellow circle with dollar sign look
    const coinGfx = this.make.graphics({ x: 0, y: 0 });
    coinGfx.fillStyle(0xffcc00, 1);
    coinGfx.fillCircle(12, 12, 12);
    coinGfx.lineStyle(2, 0xffee66, 1);
    coinGfx.strokeCircle(12, 12, 12);
    coinGfx.fillStyle(0xcc9900, 1);
    coinGfx.fillCircle(12, 12, 6);
    coinGfx.generateTexture('coin', 24, 24);
    coinGfx.destroy();

    // Particle: small white circle
    const particleGfx = this.make.graphics({ x: 0, y: 0 });
    particleGfx.fillStyle(0xffffff, 1);
    particleGfx.fillCircle(4, 4, 4);
    particleGfx.generateTexture('particle', 8, 8);
    particleGfx.destroy();

    // Star particle for background
    const starGfx = this.make.graphics({ x: 0, y: 0 });
    starGfx.fillStyle(0xffffff, 0.8);
    starGfx.fillCircle(2, 2, 2);
    starGfx.generateTexture('star', 4, 4);
    starGfx.destroy();
  }

  create(): void {
    // Generate silent audio placeholders if real audio failed to load
    this.createSilentAudio('coin');
    this.createSilentAudio('hit');
    this.createSilentAudio('start');
    this.createSilentAudio('gameover');

    this.scene.start('MenuScene');
  }

  private createSilentAudio(key: string): void {
    // Only create if the real audio key doesn't exist
    if (!this.cache.audio.exists(key)) {
      // Check if the _sfx variant was loaded
      if (this.cache.audio.exists(key + '_sfx')) {
        // Alias the _sfx version as the base key
        const audioData = this.cache.audio.get(key + '_sfx');
        this.cache.audio.add(key, audioData);
      }
      // If neither exists, sound.play will just silently fail which is fine
    }
  }
}
