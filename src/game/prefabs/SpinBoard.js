import { EventBus } from '../EventBus';
import { List3DBar } from './List3DBar';
import { SpinItem } from './SpinItem';

export class SpinBoard extends Phaser.GameObjects.Container {
  // Containers
  f_fx; f_zoe; f_columns; f_overlays; f_logoStuff;
  // Images
  f_stackL; f_stackR; f_girl; f_celebrate; f_money1; f_money2;
  f_bg; f_overlay; f_border; f_stars; f_logo;
  // Sprites
  f_highlight;
  // Tweens
  f_girlBreath; f_moneyBreath;

  constructor(scene, x, y, children) {
    super(scene, x, y, children);

    this.scene = scene;
    this.x = x;
    this.y = y;

    // --- inside your Prefab class constructor or create method ---

    // make sure this container is added to the scene:
    scene.add.existing(this);

    // FX container
    this.f_fx = this.scene.add.container(0, 0);
    this.add(this.f_fx);

    this.f_stackR = this.scene.add.image(210, 0, 'coin_2');
    this.f_stackL = this.scene.add.image(-210, 0, 'coin_2').setScale(-1, 1);
    this.f_fx.add([this.f_stackR, this.f_stackL]);

    // Zoe container
    this.f_zoe = this.scene.add.container(85, -210);
    this.add(this.f_zoe);

    this.f_girl = this.scene.add.image(33, 0, 'zoe_default');
    this.f_celebrate = this.scene.add.image(59, -63, 'zoe_celebrate').setAlpha(0);
    this.f_money1 = this.scene.add.image(33, -62, 'zoe_money_1').setAlpha(0);
    this.f_money2 = this.scene.add.image(60, -31.5, 'zoe_money_2').setAlpha(0);
    this.f_zoe.add([this.f_girl, this.f_celebrate, this.f_money1, this.f_money2]);

    // background & overlay
    this.f_bg = this.scene.add.image(0, 0, 'slots_blank').setOrigin(0.5);
    this.f_overlay = this.scene.add.image(0, 0, 'slots_darken').setOrigin(0.5);
    this.f_border = this.scene.add.image(0, 0, 'slots_border').setOrigin(0.5);
    this.add([this.f_bg, this.f_overlay, this.f_border]);

    // Columns container
    this.f_columns = this.scene.add.container(0, 0).setDepth(200);
    this.add(this.f_columns);

    // Columns
    const colPositions = [-227, -114, 0, 113, 227];
    colPositions.forEach(x => {
      let col = new List3DBar(this.scene, x, 0);
      this.f_columns.add(col);
    });

    // Overlays container
    this.f_overlays = this.scene.add.container(0, 0);
    this.add(this.f_overlays);

    const overlayPositions = [-227, -114, 0, 113, 227];
    overlayPositions.forEach(x => {
      let spinItem = new SpinItem(this.scene, x, 0);
      this.f_overlays.add(spinItem);
    });

    // Logo stuff
    this.f_logoStuff = this.scene.add.container(-200, -200);
    this.add(this.f_logoStuff);

    this.f_stars = this.scene.add.image(-33, -5, 'logo_gameplay_stars');
    this.f_logo = this.scene.add.image(44, -135, 'logo_gameplay');
    this.f_logoStuff.add([this.f_stars, this.f_logo]);

    // Pink highlight (animated) stays a Sprite:
    this.f_highlight = this.scene.add.sprite(227, 5, 'Pink_Rectangle', 'Pink_Rectangle_0000_Rectangle-Sparkly39.png');
    this.f_highlight.setScale(0.85, 0.925);
    this.add(this.f_highlight);

    const reversedFrameNames = [];
    for (let i = 0; i <= 39; i++) {
      const index = i.toString().padStart(4, '0');
      const suffixNum = (39 - i).toString().padStart(2, '0');
      reversedFrameNames.push(`Pink_Rectangle_${index}_Rectangle-Sparkly${suffixNum}.png`);
    }

    this.f_highlight.anims.create({
      key: 'idle',
      frames: reversedFrameNames.map(frame => ({
        key: 'Pink_Rectangle',
        frame: frame
      })),
      frameRate: 15,
      repeat: -1
    });
    this.f_highlight.play('idle');

    this.scene.add.existing(this);

    this.initMask();

    this.f_zoe.ogX = this.f_zoe.x;
    this.f_stackR.ogX = this.f_stackR.x;
    this.f_stackL.ogX = this.f_stackL.x;

    // this.matchSignal = new Phaser.Signal();
    // this.resetSignal = new Phaser.Signal();

    this.sounds = ['zoe_yay', 'zoe_wow', 'zoe_amazing'];
    this.sounds.index = 0;

    this.f_girlBreath = this.scene.tweens.add({
      targets: this.f_girl,
      scaleX: '-=0.02',
      scaleY: '+=0.02',
      duration: 2000,
      ease: 'Quad.easeInOut',
      delay: 50,
      yoyo: true,
      repeat: -1
    });

    this.f_moneyBreath = this.scene.tweens.add({
      targets: this.f_money1,
      scaleX: '-=0.02',
      scaleY: '+=0.02',
      duration: 2000,
      ease: 'Quad.easeInOut',
      delay: 50,
      yoyo: true,
      repeat: -1
    });

    this.setup();

  }

  initMask() {
    // === OVERLAY MASK ===
    this.overlayMask = this.scene.make.graphics();
    // this.add(this.overlayMask);
    this.overlayMask.fillStyle(0x00FF00);
    this.overlayMask.fillRect(
      this.x - 58 - this.f_overlay.displayWidth * 0.4, // equivalent of .left (anchor at center)
      this.y - this.f_overlay.displayHeight * 0.5, // .top
      this.f_overlay.displayWidth * 0.8,
      this.f_overlay.displayHeight
    );

    // Create a geometry mask and assign it
    // const overlayMaskObj = this.overlayMask.createGeometryMask();
    // this.f_overlay.setMask(overlayMaskObj);
    this.f_overlay.mask = new Phaser.Display.Masks.GeometryMask(this.scene, this.overlayMask);
    // this.overlayMask.setVisible(false);

    // === BOARD MASK ===
    this.boardMask = this.scene.make.graphics();
    // this.add(this.boardMask);
    this.boardMask.fillStyle(0xFF0000);

    const dx = 3;
    this.boardMask.fillRect(
      this.x - this.f_overlay.displayWidth * 0.5 - dx,
      this.y - this.f_overlay.displayHeight * 0.5 - dx,
      this.f_overlay.displayWidth + dx * 2,
      this.f_overlay.displayHeight + dx * 2
    );

    // Create geometry mask and assign
    // const boardMaskObj = this.boardMask.createGeometryMask();
    // this.f_columns.setMask(boardMaskObj);
    this.f_columns.mask = new Phaser.Display.Masks.GeometryMask(this.scene, this.boardMask);
    // this.boardMask.setVisible(false);

  }

  setup() {
    this.matchName = 'bonus';
    // this.slotSound = this.game.add.audio('slot_spin');

    this.columns = [['bonus', 'k', '10', '9', 'a', 'bell', 'cherry', 'j', 'lemon', 'watermelon', 'q', 'orange'],
    ['bonus', '10', 'cherry', 'lemon', 'a', 'j', 'q', 'watermelon', 'k', 'bell', 'orange', '9'],
    ['bonus', '9', 'cherry', 'q', 'j', 'bell', 'lemon', '10', 'orange', 'a', 'watermelon', 'k'],
    ['bonus', 'k', 'a', 'j', '10', '9', 'watermelon', 'q', 'bell', 'lemon', 'cherry', 'orange'],
    ['watermelon', 'orange', 'k', 'cherry', '9', 'q', 'lemon', '10', 'j', 'a', 'bell', 'bonus']];

    this.f_columns.list.forEach((col, i) => {
      // col.setupSignals();

      const arr = this.columns[i].map(symbolName => {
        const sym = new SpinItem(this.scene, 0, 0);
        sym.setup(symbolName);
        return sym;
      });

      col.easySetup(1);
      col.setupSprites(arr);
      col.disableInput();
    });

    // Setup overlays
    this.f_overlays.each(s => {
      s.setup(this.matchName);
    });
    this.f_overlays.getAt(this.f_overlays.length - 1).alpha = 0;
    this.idleBump();
  }

  update(time, dt) {
    this.f_columns.each(col => col.update(time, dt))
  }

  activate() {
    switch (this.phase) {
      case 0:
        this.matchName = 6;
        this.spin();
        this.phase = 1;
        break;
      case 1:
        this.phase = 2;
        this.spin();
        break;
      default:
        this.f_overlays.each((o) => {
          this.scene.tweens.killTweensOf(o);
          o.scale = 1;
        });
        this.f_columns.tween.stop();
        this.matchName = 'bonus';
        this.phase = 0;
        this.scene.tweens.add({
          targets: this.f_highlight,
          alpha: 0,
          duration: 250
        });
        this.spin(true);
    }
  }

  spin(isOneCol) {
    this.f_columns.list.forEach((c, index) => {
      if (isOneCol && index !== this.f_columns.length - 1) return;

      this.scene.time.delayedCall(isOneCol ? 100 : 200 * index + 100, () => {
        c.setManualDistance({ val: 10 });

        c.f_items.each(it => {
          it.getAt(0).setBlur(true);
        });

        c.hasSnap = false;

        const stop = typeof this.matchName === 'string'
          ? c.f_items.getByName(this.matchName)
          : c.childArray[this.matchName];

        if (stop) {
          this.scene.time.delayedCall(1000, () => {
            c.toFront(stop, 500);
            c.f_items.each(it => {
              it.getAt(0).setBlur(false);
            });
            // c.sound.play('', { volume: 1 });

            // if (!this.slotSound.isFading) {
            //   this.slotSound.isFading = true;
            //   this.slotSound.fadeOut(500);

            //   this.slotSound.fadeTween.once('complete', () => {
            //     this.slotSound.pause();
            //     this.slotSound = false;
            //   });
            // }
          });
        }
      });
    });

    const delay = 100 * this.f_columns.length + 1500;

    // this.slotSound.play('', { volume: 1.25, loop: true });
    // this.slotSound.isFading = false;

    if (this.matchName) {
      this.scene.tweens.add({
        targets: this.f_overlay,
        alpha: 0,
        duration: 250,
        delay: delay - 250,
        onComplete: () => {
          this.scene.tweens.add({
            targets: this.f_overlays,
            alpha: 0,
            duration: 250,
          });

          // this.sound.play('Win ' + (this.sounds.index + 1).toString(), { volume: 1 });

          this.shakeGoods();
          this.coins(this.phase === 1, this.phase === 2);
        }
      });

      if (typeof this.matchName !== 'string') {
        this.scene.tweens.add({
          targets: this.f_overlay,
          x: '0',
          duration: 50,
          delay: delay / 2,
          onComplete: () => {
            this.setWilds(this.phase === 1);
          }
        });
      }
    }
  }


  resetColumns() {
    this.f_columns.list.forEach((c, index) => {
      this.scene.time.delayedCall(200 * index + 100, () => {
        c.setManualDistance({ val: 82 });

        c.f_items.each(it => {
          it.getAt(0).setBlur(true);
        });

        c.hasSnap = true;

        this.scene.time.delayedCall(100, () => {
          if (c.inertiaTween && c.inertiaTween.on) {
            c.inertiaTween.once('complete', () => {
              c.f_items.each(it => {
                it.getAt(0).setBlur(false);
              });

              // c.sound.play('', { volume: 1 });

              // if (!this.slotSound.isFading) {
              //   this.slotSound.isFading = true;
              //   this.slotSound.fadeOut(500);

              //   this.slotSound.fadeTween.once('complete', () => {
              //     this.slotSound.pause();
              //     this.slotSound = false;
              //   });
              // }
            });
          }
        });
      });
    });

    const delay = 100 * this.f_columns.length + 1500;

    // this.slotSound.play('', { volume: 1.25, loop: true });
    // this.slotSound.isFading = false;

    this.scene.tweens.add({
      targets: this.f_overlay,
      alpha: 0,
      duration: 250,
      delay: delay - 250,
      onComplete: () => {
        this.scene.events.emit('spinBoardReset');
      }
    });
  }

  shakeGoods() {
    const match = typeof this.matchName == 'string' ? this.matchName : 'wild';

    this.f_columns.each((c) => {
      c.f_items.each((item) => {
        if (item.name === match)
          item.getAt(0).selected(200, 600, 1500);
      });
    });
  }

  layerMatch() {
    this.f_columns.list.forEach((col, i) => {
      const front = col.f_items.frontItem.getAt(0); // assumes f_items is a container or object with frontItem
      const top = this.f_overlays.getAt(i);

      top.setup(front.name);
      top.setAlpha(1);
      top.highlight(true, i * 75);
    });

    // this.sound.play('column_win', { volume: 0.5 });
  }


  backToBasics(isFlushed) {
    this.resetColumns();

    // Slide stacks back to y: 0
    this.scene.tweens.add({
      targets: [this.f_stackR, this.f_stackL],
      y: 0,
      duration: 300,
      ease: 'Quad'
    });

    // Fade in logo stuff
    this.scene.tweens.add({
      targets: this.f_logoStuff,
      alpha: 1,
      duration: 200,
      delay: 200
    });

    // Move zoe to original X and handle child alphas
    this.scene.tweens.add({
      targets: this.f_zoe,
      x: this.f_zoe.ogX,
      duration: 300,
      ease: 'Quad',
      onComplete: () => {
        if (this.f_zoe.getChildren) {
          this.f_zoe.each(child => {
            child.setAlpha(0);
          });
        }

        if (isFlushed) {
          this.f_money1.setAlpha(1);
          this.f_celebrate.setAlpha(0);
        } else {
          this.f_girl.setAlpha(1);
        }
      }
    });

    // Fade out overlays
    this.scene.tweens.add({
      targets: this.f_overlays,
      alpha: 0,
      duration: 250,
    });
  }


  setWilds(isOdd) {
    const targetColumn = isOdd ? 1 : 0;
    // for (var i = 0; i < this.f_columns.length; i++) {
    this.f_columns.list.forEach((col, i) => {
      if (i % 2 == targetColumn) {
        var w = col.childArray[this.matchName - 1];
        w.name = 'wild'; w.getAt(0).setup('wild');
        w = col.childArray[this.matchName + 1];
        w.name = 'wild'; w.getAt(0).setup('wild');
      } else {
        var w = col.childArray[this.matchName];
        w.name = 'wild'; w.getAt(0).setup('wild');
      }
    });
  }

  idleBump() {
    // === Overlay Tweens: Looping chain ===
    const duration = 300;
    const yoyoHold = 100;

    // const timeline = this.scene.add.timeline();

    this.f_overlays.list.forEach((obj, i, arr) => {
      this.scene.tweens.add({
        targets: obj,
        scale: '+=.1',
        duration: duration,
        delay: i * duration,
        repeatDelay: (this.f_overlays.length - 2) * duration,
        ease: 'Quad',
        yoyo: true,
        repeat: -1,
      });
    });

    // timeline.loop -1;
    // timeline.play();

    // Start the first tween
    // this.f_overlays.getAt(0).tween.play();

    // === Column Fade-Out Tween with Loop Action ===
    const lastColumn = this.f_columns.getAt(this.f_columns.length - 1);
    lastColumn.hasSnap = true;

    this.f_columns.tween = this.scene.tweens.add({
      targets: this.f_columns,
      alpha: 1,
      duration: 2000,
      ease: 'Linear',
      delay: 100,
      repeat: -1,
      yoyo: false,
      onRepeat: () => {
        lastColumn.setManualDistance({ val: 2 });
      }
    });

    // Call it once initially
    lastColumn.setManualDistance({ val: 2 });

  }

  coins(isSmallWin, isBigWin) {
    // Slide zoe to x: 0
    this.scene.tweens.add({
      targets: this.f_zoe,
      x: 0,
      duration: 300,
      ease: 'Quad'
    });

    // Fade out logoStuff and chain logic on complete
    this.scene.tweens.add({
      targets: this.f_logoStuff,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        // Play next sound
        // this.sound.play(this.sounds[this.sounds.index++], { volume: 1 });

        let max = 20;

        if (isSmallWin) {
          max = 7;
        } else {
          this.f_girl.setAlpha(0);

          if (isBigWin) {
            this.f_money2.setAlpha(1);
            this.f_celebrate.setAlpha(0);
          } else {
            this.f_celebrate.setAlpha(1);
            this.f_girl.setAlpha(0);
          }

          const dist = isBigWin ? -225 : -150;

          // Stack R wobble while rising
          this.scene.tweens.add({
            targets: [this.f_stackL, this.f_stackR],
            y: dist,
            duration: 1000,
            ease: 'Quad',
            onUpdate: () => {
              this.f_stackL.x = this.f_stackL.ogX + (Phaser.Math.RND.between(0, 1) * 4 - 2);
              this.f_stackR.x = this.f_stackR.ogX + (Phaser.Math.RND.between(0, 1) * 2 - 1);
            }
          });
        }

        // Zoe squash stretch
        this.scene.tweens.add({
          targets: this.f_zoe,
          scaleY: '+=.01',
          duration: 300,
          ease: 'Back',
          yoyo: true
        });

        // Launch coin FX
        this.coinFX(max);

        // Fade in FX container
        this.scene.tweens.add({
          targets: this.f_fx,
          alpha: 1,
          duration: 1200,
          onComplete: () => {
            this.scene.events.emit('spinBoardMatch', this.phase);
          }
        });
      }
    });
  }


  coinFX(max) {
    const coins = ['coin_1', 'coin_3'];
    const m = max || 20;

    // this.sound.play('payout', { volume: 1 });

    for (let i = 1; i < m; i++) {
      const x = Phaser.Math.RND.between(-250, 250);
      const s = this.scene.add.image(x, 0, Phaser.Math.RND.pick(coins));
      this.f_fx.add(s); // f_fx is a Container

      s.angle = Phaser.Math.RND.between(0, 359);
      const duration = Phaser.Math.RND.between(200, 350);
      const sign = Phaser.Math.RND.sign() * Phaser.Math.RND.between(0, 359);

      // Spin tween
      this.scene.tweens.add({
        targets: s,
        angle: `+=${sign}`,
        duration: duration * 2,
      });

      // Scale tween (not uniform)
      this.scene.tweens.add({
        targets: s,
        scale: '0.2',
        duration: duration,
        ease: 'Quad',
        delay: duration,
        yoyo: true
      });

      // Movement using timeline: float up then fall
      this.scene.add.timeline({
        targets: s,
        tweens: [
          {
            y: Phaser.Math.RND.between(-600, -350),
            duration: duration * 2,
            ease: 'Quad.easeOut',
            delay: duration / 2
          },
          {
            y: 0,
            duration: duration * 2,
            ease: 'Quad.easeIn',
            delay: 75,
            onComplete: () => {
              s.destroy();
            }
          }
        ]
      });
    }

    this.showSparkles();
  }


  showSparkles() {
    const sparkles = ['particle_1', 'particle_2', 'particle_3'];
    const p = new Phaser.Math.Vector2();

    for (let i = 1; i < 50; i++) {
      const s = this.scene.add.image(0, -300, Phaser.Math.RND.pick(sparkles));
      this.f_fx.add(s);

      const duration = Phaser.Math.RND.between(350, 750);
      const sign = Phaser.Math.RND.sign() * Phaser.Math.RND.between(0, 359);

      // Set vector p to length 150–250, then rotate by a random angle
      p.set(Phaser.Math.RND.between(150, 250), 0);
      p.rotate(Phaser.Math.DegToRad(Phaser.Math.RND.between(0, 359)));

      // Spin tween (infinite)
      this.scene.tweens.add({
        targets: s,
        angle: sign,
        duration: duration * 2,
        repeat: -1
      });

      // Shrink tween with yoyo
      const scaleTween = this.scene.tweens.add({
        targets: s,
        scale: 0,
        duration: duration,
        ease: 'Quad',
        delay: duration * 2,
        yoyo: true,
        onComplete: () => {
          s.destroy();
        }
      });

      // Movement tween (x/y)
      this.scene.tweens.add({
        targets: s,
        x: `+=${p.x}`, // maintain string format for relative support if needed
        y: `+=${p.y}`,
        duration: duration * 2,
        ease: 'Quad',
        delay: duration / 2
      });
    }
  }


  printColumn(c) {
    const str = c.wheel.list.map(i => i.name).join(', ');
    console.log(str);
  }
}