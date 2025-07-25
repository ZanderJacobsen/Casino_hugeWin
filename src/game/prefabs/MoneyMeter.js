import { EventBus } from '../EventBus';

export class MoneyMeter extends Phaser.GameObjects.Container {
  //Images
  f_box; f_coin;
  //Texts
  f_text;
  //Others
  num; textNum;

  constructor(scene, x, y, children) {
    super(scene, x, y, children);

    this.scene = scene;
    this.x = x;
    this.y = y;

    this.f_box = this.scene.add.image(25, 0, "moneymeter_box");
    this.f_coin = this.scene.add.image(-200, 0, "moneymeter_coin");

    this.f_text = this.scene.add.text(25, -2, '$0.00', {
      fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
      stroke: '#0080c0', strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5).setDepth(100);

    this.add([this.f_box, this.f_coin, this.f_text]);

    this.num = 0; this.textNum = this.num;

    this.scene.add.existing(this);
  }

  calcString(num) {
    let str = '$';
    if (num >= 1000) {
      str += Math.floor(num / 1000).toString() + ',';
      str += Math.floor(this.textNum % 1000).toString().padStart(3, '0');
    } else {
      str += Math.floor(this.textNum % 1000).toString();
    }
    str += '.' + Math.round((this.textNum % 1) * 100).toString().padStart(2, '0');

    return str;
  }

  updateMoney(num) {
    this.num += num;
    this.num = Math.round(this.num * 100) / 100;
    if (this.num > 10000) this.num = 10000;

    this.scene.tweens.killTweensOf([this.f_text, this.f_coin]);

    this.scene.tweens.add({
      targets: this,
      textNum: this.num,
      duration: 100,
      ease: 'Linear',
      onUpdate: () => {
        let str = this.calcString(this.textNum);
        this.f_text.text = str;
      },
      onComplete: () => {
        let str = this.calcString(this.num);
        this.f_text.text = str;
      }
    });

    this.f_coin.scale = 1;

    this.scene.tweens.add({
      targets: this.f_coin,
      scale: '+=.1',
      duration: 100,
      ease: 'Linear',
      yoyo: true
    });
  }

  coinFx(row) {
    // this.game.sound.play(this.moneyGoal > 550 ? 'coins_jackpot' : 'small_coins', 1, false);
    let p = new Phaser.Math.Vector2(0, 0);

    for (let i = 0; i < this.moneyGoal / 10; i++) {
      let dx = Phaser.Math.RND.integerInRange(-240, 240);
      let dy = Phaser.Math.RND.integerInRange(-150, -100);
      let s = this.scene.add.image(dx, dy, `coin_0${Phaser.Math.RND.integerInRange(1, 3)}`);
      this.f_fx.add(s);
      s.i = i;

      let ang = -90 + (dx / 240) * 60;
      let dist = Phaser.Math.RND.integerInRange(150, 250);
      p.set(dist, 0).rotate(0, 0, Phaser.Math.DegToRad(ang));

      let duration = Phaser.Math.RND.integerInRange(500, 750);

      // Scale up to 1,1
      this.scene.tweens.add({
        targets: s,
        scale: 1,
        duration: duration / 2,
        ease: 'Quad.easeOut'
      });

      // Move to p.x
      this.scene.tweens.add({
        targets: s,
        x: p.x,
        x: { value: s.x + p.x, ease: 'Cubic.easeOut' },
        y: { value: s.y + p.y, ease: 'Linear' },
        duration: duration * 2,
        delay: duration * 0.5,
        onComplete: () => {
          // Drop down a bit
          this.scene.tweens.add({
            targets: s,
            y: s.i * 2 + s.y,
            duration: s.i * 10,
            ease: 'Quad.easeIn',
            onComplete: () => {
              let dur = Phaser.Math.RND.integerInRange(250, 400);
              // Scale down
              this.scene.tweens.add({
                targets: s,
                scale: 0.5,
                duration: dur + s.i * 10,
                ease: 'Quad.easeOut',
                yoyo: true
              });
              // Move to money
              this.scene.tweens.add({
                targets: s,
                x: this.f_money.x - 100,
                x: { value: this.f_money.x - 100, ease: 'Back' },
                y: { value: this.f_money.y, ease: 'Linear' },
                duration: dur * 2 + s.i * 5,
                onComplete: () => {
                  s.destroy();
                  this.updateMoney(10);
                }
              });
            }
          });
        }
      });
    }
  }

  loseCoins() {
    // this.game.sound.play('small_coins', 0.5, false);
    updateMoney(-this.num);

    for (let i = 0; i < 100; i++) {
      let s = this.scene.add.image(this.f_money.x, this.f_money.y, `coin_0${Phaser.Math.RND.integerInRange(1, 3)}`);
      this.f_fx.add(s);
      s.scale.set(0);
      let duration = Phaser.Math.RND.integerInRange(1000, 1500);
      let del = i * 15;
      let dist = Phaser.Math.RND.integerInRange(50, 300);
      let yDist = dist - 400;
      dist *= Math.round(Math.random()) * 2 - 1;

      this.scene.tweens.add({
        targets: s,
        scale: { value: 1, ease: 'Quad' },
        y: { value: s.y + yDist, ease: 'Cubic' },
        duration: duration / 4,
        delay: del,
        onComplete: () => {
          this.scene.tweens.add({
            targets: s,
            y: '+=600',
            duration: duration*3/4,
            ease: 'Cubic.easeIn'
          })
        }
      })
      this.scene.tweens.add({
        targets: s,
        x: s.x + dist,
        duration: duration,
        delay: del,
        onComplete: () => {
          s.destroy();
        }
      })
    }
  }
}