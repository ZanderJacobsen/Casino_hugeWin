import { EventBus } from '../EventBus';

export class CTA extends Phaser.GameObjects.Container {
    // Containers
    f_fx; f_btns; f_arrows;
    // Images
    f_gray; f_green; f_right; f_left;
    // Texts
    f_text;
    // Tweens
    loopTween; leftTween; rightTween;

    constructor(scene, x, y, children) {
        super(scene, x, y, children);

        this.scene = scene;
        this.x = x;
        this.y = y;

        this.f_fx = this.scene.add.container(0, 0);

        this.f_gray = this.scene.add.image(0, 0, "button_spin_gray");
        this.f_green = this.scene.add.image(0, 0, "button_spin_green");
        this.f_btns = this.scene.add.container(0, 0, [this.f_gray, this.f_green]);

        this.f_right = this.scene.add.image(225, 0, "spin_arrow");
        this.f_left = this.scene.add.image(-225, 0, "spin_arrow").setScale(-1, 1);
        this.f_arrows = this.scene.add.container(0, 0, [this.f_right, this.f_left]);

        // Shadow color: 004600
        this.f_text = this.scene.add.text(-3, -6, 'SPIN', {
            fontFamily: 'Arial Black', fontSize: 60, color: '#ffffff',
            stroke: '#004600', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        this.f_text.setShadow(0, 6, '#004600', 3);

        this.add([this.f_fx, this.f_btns, this.f_arrows, this.f_text]);
        this.f_btns.setInteractive(this.f_green.getBounds().setPosition(-this.f_green.width / 2, -this.f_green.height / 2), Phaser.Geom.Rectangle.Contains);

        this.scene.add.existing(this);
    }

    enableBtn(isInstant) {
        this.f_text.setStroke('#004600');
        this.f_text.setShadowFill('#004600');
        this.f_text.setShadowStroke('#004600');

        if (isInstant) {
            this.f_fx.alpha = 1;
            this.f_green.alpha = 1;
            this.f_arrows.alpha = 1;
        } else {
            this.scene.tweens.add({
                targets: [this.f_fx, this.f_greeen, this.f_arrows],
                alpha: 1,
                duration: 150,
            })
        }
        this.loopArrows();
    }

    disableBtn(isInstant, isClick) {
        this.f_text.setStroke('#333333');
        this.f_text.setShadowFill('#333333');
        this.f_text.setShadowStroke('#333333');

        if (isInstant) {
            this.f_fx.alpha = 0;
            this.f_green.alpha = 0;
            this.f_arrows.alpha = 0;
        } else {
            let del = 0;
            if (isClick) {
                del = 300;
                // this.game.sound.play('tap', 3, false);
                this.scene.tweens.add({
                    targets: [this.f_text, this.f_btns],
                    scale: "-=.1",
                    duration: 75,
                    yoyo: true
                })
            }
            this.scene.tweens.add({
                targets: [this.f_fx, this.f_greeen, this.f_arrows],
                alpha: 0,
                duration: 150,
                delay: del
            })
        }
        this.loopArrows(true);
    }

    loopArrows(turnOff) {
        if (turnOff) {
            this.loopTween.pause();
            this.leftTween.pause();
            this.rightTween.pause();
            return;
        }

        if (this.loopTween) {
            this.loopTween.resume();
            this.leftTween.resume();
            this.rightTween.resume();
        }
        else {
            this.loopTween = this.scene.tweens.add({
                targets: this,
                scale: "-=.04",
                duration: 500,
                delay: 250,
                ease: 'Quad',
                repeat: -1,
                yoyo: true
            })

            this.leftTween = this.scene.tweens.add({
                targets: this.f_left,
                x: "+=25",
                duration: 500,
                ease: 'Circ.easeInOut',
                repeat: -1,
                yoyo: -1
            })

            this.rightTween = this.scene.tweens.add({
                targets: this.f_right,
                x: "-=25",
                duration: 500,
                ease: 'Circ.easeInOut',
                repeat: -1,
                yoyo: true
            })
        }
    }

    setText(text) {
        this.f_text.setText(text);
        this.f_text.scale = 1;
        if (this.f_text.displayWidth > 280) {
            this.f_text.displayWidth = 280;
            this.f_text.scaleY = this.f_text.scaleX;
        }
    }

    showSparkles(max) {
        let sparkles = ["particle_1", "particle_2", "particle_3"];
        let p = new Phaser.Math.Vector2(0, 0);
        let p2 = new Phaser.Math.Vector2(0, 0);
        // Rectangle is 150x50
        let w = 150; let h = 85;
        let m = max ? max : 150;

        for (let i = 0; i < m; i++) {
            let x = Phaser.Math.RND.integerInRange(0, 2 * h + 2 * w);
            if (x < h) {
                p.set(-w, x - h / 2);
            }
            else if (x < h + w)
                p.set((x - h - w / 2) * 2, -h / 2);
            else if (x < h * 2 + w) {
                p.set(w, x - (h + w + h / 2));
            }
            else
                p.set((x - (h * 2 + w) - w / 2) * 2, h / 2);
            let s = this.scene.add.image(p.x, p.y, Phaser.Math.RND.pick(sparkles));
            this.f_fx.add(s); 
            let duration = Phaser.Math.RND.integerInRange(500, 750);
            let delay = Phaser.Math.RND.integerInRange(100, 1500);
            let sign = Math.round(Math.random()) * 2 - 1;

            p2.set(s.x, s.y).setLength(p2.length() * .8);
            s.setPosition(p2.x, p2.y);
            p.setLength(p.length() + 75);

            // Angle tween (infinite repeat)
            this.scene.tweens.add({
                targets: s,
                angle: 359 * sign,
                duration: duration * 2,
                repeat: -1
            });

            // Position tween (infinite repeat, yoyo)
            this.scene.tweens.add({
                targets: s,
                x: p.x,
                y: p.y,
                duration: duration * 2,
                ease: 'Quad.easeOut',
                delay: delay,
                repeat: -1,
                yoyo: true,
                onYoyo: () => {
                    // Fade out on yoyo (reverse)
                    this.scene.tweens.add({
                        targets: s,
                        alpha: 0,
                        duration: 50,
                    });
                },
                onRepeat: () => {
                    // Fade in on repeat (forward)
                    this.scene.tweens.add({
                        targets: s,
                        alpha: 1,
                        duration: 50,
                    });
                }
            });
        }
    }
}