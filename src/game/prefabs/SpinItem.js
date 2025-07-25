import { EventBus } from '../EventBus';

export class SpinItem extends Phaser.GameObjects.Container {
  //Images
  f_item; f_blur;
  //Sprites
  f_highlight;

  constructor(scene, x, y, children) {
    super(scene, x, y, children);

    this.scene = scene;
    this.x = x;
    this.y = y;

    this.f_highlight = this.scene.add.sprite(0, 0, "Pink_Square", 'Pink_Square__0000_Square-Sparkles11.png');
    this.f_highlight.setScale(0.825, 0.95).setAlpha(0);

    const reversedFrameNames = [];
    for (let i = 0; i <= 11; i++) {
      const index = i.toString().padStart(4, '0');
      const suffixNum = (11 - i).toString().padStart(2, '0');
      reversedFrameNames.push(`Pink_Square__${index}_Square-Sparkles${suffixNum}.png`);
    }

    this.f_highlight.anims.create({
      key: 'idle',
      frames: reversedFrameNames.map(frame => ({
        key: 'Pink_Square',
        frame: frame
      })),
      frameRate: 15,
      repeat: -1
    });
    this.f_highlight.play('idle');

    this.f_item = this.scene.add.image(0, 0, "slots_10");
    this.f_blur = this.scene.add.image(0, 0, "slots_10_blur").setAlpha(0);

    this.add([this.f_item, this.f_blur, this.f_highlight]);

    this.scene.add.existing(this);
  }

  highlight(isOn, del) {
    let d = del ? del : 50;

    this.scene.tweens.add({
      targets: this.f_highlight,
      alpha: isOn ? 1 : 0,
      duration: 150,
      ease: 'Linear',
      delay: d
    });

    this.scene.tweens.add({
      targets: this.f_item,
      scale: '+=.1',
      duration: 200,
      ease: 'Quad',
      delay: d,
      yoyo: true,
      hold: 200
    });
  }

  setBlur(isOn) {
    if (isOn) {
      this.f_item.alpha = 0;
      this.f_blur.alpha = 1;
    } else {
      this.f_item.alpha = 1;
      this.f_blur.alpha = 0;
    }
  }

  setup(name) {
    this.name = name;
    this.f_item.setTexture('slots_' + name);
    this.f_blur.setTexture('slots_' + name + '_blur');
  }

  selected(sp, dl, yo) {
    // === SCALE tween with Yoyo ===
    this.scene.tweens.add({
      targets: this.f_item,
      scale: '+=0.2',
      ease: 'Quad',
      duration: sp,
      delay: dl + sp,
      yoyo: true,
      hold: sp * 1.5
    });

    const angleTween = this.scene.tweens.add({
      targets: this.f_item,
      angle: { from: -8, to: 8 },
      duration: sp / 4,
      yoyo: true,
      repeat: 3,
      paused: true, // We want to control when it starts
      onComplete: () => {
        this.scene.tweens.add({
          targets: this.f_item,
          angle: 0,
          duration: sp / 8,
        });
      }
    });

    // Seek to halfway (50%) and play from there
    angleTween.seek(0.5);
    angleTween.play();


    // === HIGHLIGHT alpha tween with Yoyo ===
    this.scene.tweens.add({
      targets: this.f_highlight,
      alpha: 1,
      duration: sp,
      delay: dl,
      yoyo: true,
      hold: yo
    });

  }
}