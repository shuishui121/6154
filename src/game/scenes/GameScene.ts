import Phaser from 'phaser';
import {
  GAME_CONFIG,
  DIFFICULTY_CONFIG,
  PIXELS_PER_METER,
  JUMP_ZONE_START,
  JUMP_ZONE_END,
  BAR_X,
  COLORS,
} from '../utils/constants';
import type { Difficulty } from '../utils/constants';

interface GameSceneData {
  difficulty: Difficulty;
}

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private bar!: Phaser.GameObjects.Rectangle;
  private leftPole!: Phaser.GameObjects.Rectangle;
  private rightPole!: Phaser.GameObjects.Rectangle;
  private ground!: Phaser.GameObjects.Rectangle;
  private track!: Phaser.GameObjects.Rectangle;
  private jumpZone!: Phaser.GameObjects.Rectangle;
  private clouds: Phaser.GameObjects.Image[] = [];

  private runSpeed: number = 0;
  private maxRunSpeed: number = 350;
  private isJumping: boolean = false;
  private isRunning: boolean = false;
  private jumpStartX: number = 150;
  private barHeight: number = 1.2;
  private combo: number = 0;
  private difficulty: Difficulty = 'normal';
  private hasPassedBar: boolean = false;
  private hasHitBar: boolean = false;
  private isLanded: boolean = false;
  private isGameActive: boolean = false;
  private perfectTiming: boolean = false;
  private maxSpeedReached: boolean = false;
  private runAnimFrame: number = 0;
  private runAnimTimer: number = 0;

  private accelerationKey!: Phaser.Input.Keyboard.Key;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private spaceKey!: Phaser.Input.Keyboard.Key;

  private onHeightUpdate!: (height: number) => void;
  private onComboUpdate!: (combo: number) => void;
  private onSpeedUpdate!: (speed: number, maxSpeed: number) => void;
  private onJumpZoneEnter!: (inZone: boolean) => void;
  private onGameOver!: (finalHeight: number, perfect: boolean, maxSpeed: boolean) => void;
  private onSuccess!: (height: number, combo: number, perfect: boolean) => void;

  constructor() {
    super('GameScene');
  }

  init(data: GameSceneData) {
    this.difficulty = data.difficulty || 'normal';
  }

  setCallbacks(callbacks: {
    onHeightUpdate?: (height: number) => void;
    onComboUpdate?: (combo: number) => void;
    onSpeedUpdate?: (speed: number, maxSpeed: number) => void;
    onJumpZoneEnter?: (inZone: boolean) => void;
    onGameOver?: (finalHeight: number, perfect: boolean, maxSpeed: boolean) => void;
    onSuccess?: (height: number, combo: number, perfect: boolean) => void;
  }) {
    if (callbacks.onHeightUpdate) this.onHeightUpdate = callbacks.onHeightUpdate;
    if (callbacks.onComboUpdate) this.onComboUpdate = callbacks.onComboUpdate;
    if (callbacks.onSpeedUpdate) this.onSpeedUpdate = callbacks.onSpeedUpdate;
    if (callbacks.onJumpZoneEnter) this.onJumpZoneEnter = callbacks.onJumpZoneEnter;
    if (callbacks.onGameOver) this.onGameOver = callbacks.onGameOver;
    if (callbacks.onSuccess) this.onSuccess = callbacks.onSuccess;
  }

  create() {
    const config = DIFFICULTY_CONFIG[this.difficulty];
    this.maxRunSpeed = config.maxRunSpeed;
    this.barHeight = config.initialHeight;
    this.jumpStartX = BAR_X - config.runDistance;

    this.createBackground();
    this.createGround();
    this.createTrack();
    this.createPoles();
    this.createBar();
    this.createJumpZone();
    this.createPlayer();
    this.createClouds();

    this.setupInput();
    this.setupPhysics();

    this.startRound();
  }

  private createBackground() {
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(
      Phaser.Display.Color.HexStringToColor(COLORS.sky).color,
      Phaser.Display.Color.HexStringToColor(COLORS.sky).color,
      Phaser.Display.Color.HexStringToColor(COLORS.skyBottom).color,
      Phaser.Display.Color.HexStringToColor(COLORS.skyBottom).color,
      1
    );
    gradient.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.GROUND_Y);
  }

  private createGround() {
    this.ground = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.GROUND_Y + (GAME_CONFIG.HEIGHT - GAME_CONFIG.GROUND_Y) / 2,
      GAME_CONFIG.WIDTH,
      GAME_CONFIG.HEIGHT - GAME_CONFIG.GROUND_Y,
      Phaser.Display.Color.HexStringToColor(COLORS.grass).color
    );

    const grassTop = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.GROUND_Y,
      GAME_CONFIG.WIDTH,
      8,
      Phaser.Display.Color.HexStringToColor(COLORS.grassDark).color
    );
    grassTop.setOrigin(0.5, 0);
  }

  private createTrack() {
    this.track = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.GROUND_Y - 15,
      GAME_CONFIG.WIDTH,
      30,
      Phaser.Display.Color.HexStringToColor(COLORS.track).color
    );

    for (let i = 0; i < 20; i++) {
      const line = this.add.rectangle(
        i * 50 + 25,
        GAME_CONFIG.GROUND_Y - 15,
        2,
        25,
        Phaser.Display.Color.HexStringToColor(COLORS.trackDark).color
      );
      line.setAlpha(0.5);
    }
  }

  private createPoles() {
    const poleWidth = 12;
    const poleHeight = 350;

    this.leftPole = this.add.rectangle(
      BAR_X - 100,
      GAME_CONFIG.GROUND_Y - poleHeight / 2,
      poleWidth,
      poleHeight,
      Phaser.Display.Color.HexStringToColor(COLORS.pole).color
    );
    this.leftPole.setOrigin(0.5, 0);
    this.leftPole.y = GAME_CONFIG.GROUND_Y - poleHeight;

    this.rightPole = this.add.rectangle(
      BAR_X + 100,
      GAME_CONFIG.GROUND_Y - poleHeight / 2,
      poleWidth,
      poleHeight,
      Phaser.Display.Color.HexStringToColor(COLORS.pole).color
    );
    this.rightPole.setOrigin(0.5, 0);
    this.rightPole.y = GAME_CONFIG.GROUND_Y - poleHeight;

    for (let i = 0; i <= 10; i++) {
      const y = GAME_CONFIG.GROUND_Y - i * 30 - 30;
      if (y > GAME_CONFIG.GROUND_Y - poleHeight) {
        this.add.rectangle(BAR_X - 100, y, 20, 2, 0xffffff).setAlpha(0.7);
        const label = this.add.text(BAR_X - 130, y - 8, `${i * 0.3}`, {
          fontSize: '10px',
          color: '#ffffff',
        });
        label.setOrigin(1, 0);
      }
    }
  }

  private createBar() {
    const barY = GAME_CONFIG.GROUND_Y - this.barHeight * PIXELS_PER_METER;
    this.bar = this.add.rectangle(
      BAR_X,
      barY,
      220,
      6,
      Phaser.Display.Color.HexStringToColor(COLORS.bar).color
    );
    this.bar.setOrigin(0.5, 0.5);

    this.add.circle(
      BAR_X - 110,
      barY,
      8,
      Phaser.Display.Color.HexStringToColor(COLORS.bar).color
    ).setData('barPart', true);

    this.add.circle(
      BAR_X + 110,
      barY,
      8,
      Phaser.Display.Color.HexStringToColor(COLORS.bar).color
    ).setData('barPart', true);
  }

  private createJumpZone() {
    this.jumpZone = this.add.rectangle(
      (JUMP_ZONE_START + JUMP_ZONE_END) / 2,
      GAME_CONFIG.GROUND_Y - 15,
      JUMP_ZONE_END - JUMP_ZONE_START,
      30,
      0xffeb3b
    );
    this.jumpZone.setAlpha(0.3);

    const perfectLine = this.add.rectangle(
      (JUMP_ZONE_START + JUMP_ZONE_END) / 2,
      GAME_CONFIG.GROUND_Y - 25,
      4,
      50,
      0xff5722
    );
    perfectLine.setAlpha(0.6);
  }

  private createPlayer() {
    const playerY = GAME_CONFIG.GROUND_Y - 40;

    const graphics = this.add.graphics();

    graphics.fillStyle(0x42a5f5, 1);
    graphics.fillRect(-12, -60, 24, 40);

    graphics.fillStyle(0xffcc80, 1);
    graphics.fillCircle(0, -70, 14);

    graphics.fillStyle(0x1976d2, 1);
    graphics.fillRect(-10, -50, 20, 30);

    graphics.fillStyle(0x1565c0, 1);
    graphics.fillRect(-10, -20, 8, 20);
    graphics.fillRect(2, -20, 8, 20);

    graphics.fillStyle(0xffcc80, 1);
    graphics.fillRect(-18, -48, 8, 20);
    graphics.fillRect(10, -48, 8, 20);

    graphics.fillStyle(0x5d4037, 1);
    graphics.fillCircle(0, -78, 10);

    graphics.generateTexture('playerTexture', 40, 100);
    graphics.destroy();

    this.player = this.physics.add.sprite(this.jumpStartX, playerY, 'playerTexture');
    this.player.setCollideWorldBounds(false);
    this.player.setGravityY(DIFFICULTY_CONFIG[this.difficulty].gravity);
    this.player.setBounce(0);
    this.player.setSize(24, 80);
    this.player.setOffset(0, -10);
  }

  private createClouds() {
    for (let i = 0; i < 5; i++) {
      const cloudGraphics = this.add.graphics();
      cloudGraphics.fillStyle(0xffffff, 0.8);
      cloudGraphics.fillCircle(0, 0, 20);
      cloudGraphics.fillCircle(20, 5, 25);
      cloudGraphics.fillCircle(40, 0, 18);
      cloudGraphics.fillCircle(15, -10, 20);
      cloudGraphics.generateTexture(`cloud${i}`, 60, 40);
      cloudGraphics.destroy();

      const cloud = this.add.image(
        Phaser.Math.Between(0, GAME_CONFIG.WIDTH),
        Phaser.Math.Between(50, 200),
        `cloud${i}`
      );
      cloud.setAlpha(0.6);
      cloud.setScale(Phaser.Math.FloatBetween(0.5, 1.5));
      cloud.setData('speed', Phaser.Math.FloatBetween(5, 15));
      this.clouds.push(cloud);
    }
  }

  private setupInput() {
    this.accelerationKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.jumpKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.spaceKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.input.keyboard!.on('keydown-RIGHT', () => {
      if (this.isGameActive && this.isRunning && !this.isJumping) {
        this.accelerate();
      }
    });

    this.input.keyboard!.on('keydown-D', () => {
      if (this.isGameActive && this.isRunning && !this.isJumping) {
        this.accelerate();
      }
    });

    this.input.keyboard!.on('keydown-SPACE', () => {
      this.tryJump();
    });

    this.input.keyboard!.on('keydown-UP', () => {
      this.tryJump();
    });
  }

  private setupPhysics() {
    this.physics.world.gravity.y = DIFFICULTY_CONFIG[this.difficulty].gravity;
  }

  private startRound() {
    const config = DIFFICULTY_CONFIG[this.difficulty];
    this.runSpeed = config.maxRunSpeed * 0.3;
    this.isJumping = false;
    this.isRunning = true;
    this.hasPassedBar = false;
    this.hasHitBar = false;
    this.isLanded = false;
    this.isGameActive = true;
    this.perfectTiming = false;
    this.maxSpeedReached = false;

    this.player.setX(this.jumpStartX);
    this.player.setY(GAME_CONFIG.GROUND_Y - 40);
    this.player.setVelocityX(0);
    this.player.setVelocityY(0);
    this.player.setGravityY(0);
    this.player.angle = 0;
    this.player.setScale(1, 1);

    this.updateBarPosition();

    if (this.onHeightUpdate) {
      this.onHeightUpdate(this.barHeight);
    }
    if (this.onComboUpdate) {
      this.onComboUpdate(this.combo);
    }
    if (this.onSpeedUpdate) {
      this.onSpeedUpdate(this.runSpeed, this.maxRunSpeed);
    }
  }

  private updateBarPosition() {
    const barY = GAME_CONFIG.GROUND_Y - this.barHeight * PIXELS_PER_METER;
    this.bar.setY(barY);
  }

  private accelerate() {
    const config = DIFFICULTY_CONFIG[this.difficulty];
    const increment = config.maxRunSpeed * 0.08;
    this.runSpeed = Math.min(this.runSpeed + increment, config.maxRunSpeed);

    if (this.runSpeed >= config.maxRunSpeed * 0.99 && !this.maxSpeedReached) {
      this.maxSpeedReached = true;
    }

    if (this.onSpeedUpdate) {
      this.onSpeedUpdate(this.runSpeed, this.maxRunSpeed);
    }
  }

  private tryJump() {
    if (!this.isGameActive || this.isJumping || !this.isRunning) return;

    const playerX = this.player.x;
    const inJumpZone = playerX >= JUMP_ZONE_START && playerX <= JUMP_ZONE_END;

    if (inJumpZone) {
      this.jump();

      const zoneCenter = (JUMP_ZONE_START + JUMP_ZONE_END) / 2;
      const distanceFromCenter = Math.abs(playerX - zoneCenter);
      const zoneWidth = JUMP_ZONE_END - JUMP_ZONE_START;
      if (distanceFromCenter < zoneWidth * 0.1) {
        this.perfectTiming = true;
      }
    }
  }

  private jump() {
    this.isJumping = true;
    this.isRunning = false;

    const config = DIFFICULTY_CONFIG[this.difficulty];
    const speedRatio = this.runSpeed / config.maxRunSpeed;
    const jumpVelocity = 500 + speedRatio * 200;
    const adjustedJumpVelocity = jumpVelocity * config.jumpForceMultiplier;

    this.player.setVelocityX(this.runSpeed * 0.7);
    this.player.setVelocityY(-adjustedJumpVelocity);
    this.player.setGravityY(config.gravity);
    this.player.setScale(1, 1);

    this.tweens.add({
      targets: this.player,
      angle: 45,
      duration: 500,
      ease: 'Sine.easeInOut',
      yoyo: true,
    });
  }

  update(_time: number, delta: number) {
    if (!this.isGameActive) return;

    this.updateClouds(delta);

    if (this.isRunning && !this.isJumping) {
      this.player.setVelocityX(this.runSpeed);

      const config = DIFFICULTY_CONFIG[this.difficulty];
      const friction = config.maxRunSpeed * 0.003;
      this.runSpeed = Math.max(this.runSpeed - friction, config.maxRunSpeed * 0.2);

      if (this.onSpeedUpdate) {
        this.onSpeedUpdate(this.runSpeed, this.maxRunSpeed);
      }

      this.runAnimTimer += delta;
      if (this.runAnimTimer > 80) {
        this.runAnimTimer = 0;
        this.runAnimFrame = (this.runAnimFrame + 1) % 4;
        this.player.setScale(1, 1 + Math.sin(this.runAnimFrame * Math.PI / 2) * 0.05);
      }

      const inJumpZone =
        this.player.x >= JUMP_ZONE_START && this.player.x <= JUMP_ZONE_END;
      if (this.onJumpZoneEnter) {
        this.onJumpZoneEnter(inJumpZone);
      }

      if (this.player.x > JUMP_ZONE_END + 20 && !this.isJumping) {
        this.failJump('missed');
      }
    }

    if (this.isJumping) {
      this.checkBarCollision();

      if (this.player.y >= GAME_CONFIG.GROUND_Y - 40 && !this.isLanded) {
        this.land();
      }
    }
  }

  private updateClouds(delta: number) {
    for (const cloud of this.clouds) {
      const speed = cloud.getData('speed') || 10;
      cloud.x += speed * delta * 0.01;

      if (cloud.x > GAME_CONFIG.WIDTH + 50) {
        cloud.x = -50;
        cloud.y = Phaser.Math.Between(50, 200);
      }
    }
  }

  private checkBarCollision() {
    const playerTop = this.player.y - 40;
    const playerBottom = this.player.y + 40;
    const playerLeft = this.player.x - 12;
    const playerRight = this.player.x + 12;

    const barY = GAME_CONFIG.GROUND_Y - this.barHeight * PIXELS_PER_METER;
    const barLeft = BAR_X - 110;
    const barRight = BAR_X + 110;
    const barTop = barY - 4;
    const barBottom = barY + 4;

    if (playerRight > barLeft && playerLeft < barRight) {
      if (playerBottom > barTop && playerTop < barBottom) {
        if (!this.hasHitBar) {
          this.hasHitBar = true;
          this.hitBar();
        }
      }
    }

    if (playerLeft > barRight && !this.hasPassedBar && !this.hasHitBar) {
      this.hasPassedBar = true;
    }
  }

  private hitBar() {
    this.tweens.add({
      targets: this.bar,
      y: GAME_CONFIG.GROUND_Y - 10,
      angle: 30,
      duration: 800,
      ease: 'Bounce.easeOut',
    });

    this.cameras.main.shake(200, 0.01);
  }

  private land() {
    this.isLanded = true;
    this.player.setY(GAME_CONFIG.GROUND_Y - 40);
    this.player.setVelocityX(0);
    this.player.setVelocityY(0);
    this.player.setGravityY(0);
    this.player.angle = 0;
    this.player.setScale(1, 1);

    if (this.hasHitBar || !this.hasPassedBar) {
      this.time.delayedCall(500, () => {
        this.failJump('bar');
      });
    } else {
      this.successJump();
    }
  }

  private successJump() {
    this.combo++;

    if (this.onSuccess) {
      this.onSuccess(this.barHeight, this.combo, this.perfectTiming);
    }

    this.time.delayedCall(1000, () => {
      this.raiseBar();
      this.startRound();
    });
  }

  private raiseBar() {
    const config = DIFFICULTY_CONFIG[this.difficulty];
    this.barHeight = Math.round((this.barHeight + config.heightStep) * 100) / 100;

    if (this.onHeightUpdate) {
      this.onHeightUpdate(this.barHeight);
    }
  }

  private failJump(_reason: string) {
    this.isGameActive = false;

    if (this.onGameOver) {
      this.onGameOver(this.barHeight, this.perfectTiming, this.maxSpeedReached);
    }
  }

  public restartGame() {
    this.combo = 0;
    const config = DIFFICULTY_CONFIG[this.difficulty];
    this.barHeight = config.initialHeight;
    this.startRound();
  }

  public setDifficulty(difficulty: Difficulty) {
    this.difficulty = difficulty;
    const config = DIFFICULTY_CONFIG[difficulty];
    this.maxRunSpeed = config.maxRunSpeed;
    this.barHeight = config.initialHeight;
    this.jumpStartX = BAR_X - config.runDistance;
  }
}
