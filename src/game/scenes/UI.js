import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { MoneyMeter } from '../prefabs/MoneyMeter'

export class UI extends Scene {
    f_DL; f_icon;
    f_meter; //f_spin;
    f_attaCoins; f_attaboys; f_winFX;
    f_attaRadial; f_youWin; f_jackpot;

    constructor() {
        super('UI');
        // this.isLoaded = false;
    }

    create() {
        this.f_icon = this.add.image(65, 65, 'debugBtn').setDepth(100).setScale(0);
        this.f_DL = this.add.image(565, 1073, 'debugBtn').setDepth(100).setScale(0);
        // console.log(this.f_DL)

        this.scene.run('Game');

        this.f_icon.setInteractive();
        this.f_DL.setInteractive();
        this.f_DL.on('pointerdown', () => this.redirect(this.f_DL));
        this.f_icon.on('pointerdown', () => this.redirect(this.f_icon));

        this.f_meter = new MoneyMeter(this, 320, 75);

        this.f_attaRadial = this.add.image(0, 0, 'radial').setAlpha(0.5);
        this.f_youWin = this.add.image(0, 0, 'attaboy_1').setAlpha(0);
        this.f_jackpot = this.add.image(0, 0, 'attaboy_2').setAlpha(0);

        this.f_winFX = this.add.container(0, 0).setDepth(0);
        this.f_attaCoins = this.add.container(320, 569).setDepth(100);
        this.f_attaboys = this.add.container(320, 569, [this.f_attaRadial, this.f_youWin, this.f_jackpot]).setScale(0).setDepth(100);

        this.tweens.add({
            targets: this.f_attaRadial,
            angle: 359,
            duration: 7000,
            repeat: -1
        });

        this.bgmLoop();

        this.scene.get('Game').events.on('MeterUpdate', (val) => { this.quickMeterUpdate(val); })
        this.scene.get('Game').events.on('showAttaboy', (val) => { this.showAttaboy(); })

        EventBus.emit('current-scene-ready', this);
    }

    showEM() {
        this.scene.run('EM');
    }

    posLocaltoLocal(A, B) {
        // Get A's world position
        let worldPoint = A.getWorldTransformMatrix().decomposeMatrix();
        worldPoint = new Phaser.Math.Vector2(worldPoint.translateX, worldPoint.translateY);

        console.log(worldPoint)
        // Transform to B's local space
        const bInverseMatrix = B.getWorldTransformMatrix().invert();
        const localPoint = bInverseMatrix.transformPoint(worldPoint.x, worldPoint.y);

        return localPoint;
    }

    // changeScene ()
    // {
    //     if (this.logoTween)
    //     {
    //         this.logoTween.stop();
    //         this.logoTween = null;
    //     }

    //     this.scene.start('EM');
    // }

    bgmLoop() {
        this.input.once('pointerdown', (pointer) => {
            const clickX = pointer.x;
            const clickY = pointer.y;

            const dlBounds = this.f_DL.getBounds();
            const iconBounds = this.f_icon.getBounds();

            if (Phaser.Geom.Rectangle.Contains(dlBounds, clickX, clickY) ||
                Phaser.Geom.Rectangle.Contains(iconBounds, clickX, clickY)) {
                this.bgmLoop(); // Restart listening
            } else {
                // this.bgm = this.sound.add('BGM', { volume: 0.85, loop: true });
                // this.bgm.play();
                // this.startGame();
            }
        });
    }

    showAttaboy() {
        let index = 1;
        let coins = 50;
        let spawns = [-150, 150];
        let delay = 1500;
        const temp = this.isSecondAtta;

        if (this.isSecondAtta) {
            index++;
            coins += 50;
            spawns = [-150, 150, -75, 75];
            delay = 2500;
        }

        const atta = this.f_attaboys.getAt(index);
        atta.setAlpha(1);

        // Scale up (start)
        const t = this.tweens.add({
            targets: this.f_attaboys,
            scale: 1,
            duration: 300,
            ease: 'Back',
            onStart: () => {
                this.attaCoins(coins, spawns, temp);
            },
            onComplete: () => {
                // After scale-up, begin scale-down after `delay`
                this.tweens.add({
                    targets: this.f_attaboys,
                    scale: 0,
                    duration: 200,
                    ease: 'Quad',
                    delay: delay,
                    onComplete: () => {
                        atta.setAlpha(0);

                        if (temp == null) {
                            this.events.emit('AttaboyDone');
                        } else {
                            // this.time.delayedCall(500, this.showEM);
                            this.showEM();
                        }
                    }
                });
            }
        });

        // Run coinFall immediately if second atta
        if (this.isSecondAtta) {
            this.coinFall();
        }

        this.isSecondAtta = true;

    }

    quickMeterUpdate(val) {
        this.f_meter.updateMoney(val);
    }

    attaCoins(max, spawns, isSecond) {
        const coins = ['coin_1', 'coin_3'];
        const p = this.posLocaltoLocal(this.f_meter.f_coin, this.f_attaCoins);
        const num = this.f_meter.num;

        for (let i = 0; i < max; i++) {
            const del = i * 25;
            const x = Phaser.Math.RND.pick(spawns);

            const s = this.add.image(x, 0, Phaser.Math.RND.pick(coins));
            this.f_attaCoins.add(s);

            s.angle = Phaser.Math.RND.between(0, 359);
            const duration = Phaser.Math.RND.between(100, 250);
            const sign = (Phaser.Math.RND.sign()) * Phaser.Math.RND.between(0, 359);

            if (i % 2) {
                s.playSound = true;
            }

            // Rotation tween
            this.tweens.add({
                targets: s,
                angle: sign,
                duration: duration * 2,
                delay: del
            });

            // Scale yoyo tween
            this.tweens.add({
                targets: s,
                scale: '+=0.2',
                duration: duration,
                ease: 'Quad.easeOut',
                delay: duration + del,
                yoyo: true,
            });

            const t = this.tweens.add({
                targets: s,
                x: { value: p.x, ease: 'Back.easeIn' },
                y: { value: p.y, ease: 'Linear' },
                duration: duration * 2,
                delay: duration / 2 + del,
                onComplete: () => {
                    const val = isSecond
                        ? (10000 - num) / (max - 1)
                        : 1 + Phaser.Math.RND.between(75, 250) / 100;

                    this.f_meter.updateMoney(val);

                    if (s.playSound) {
                        this.sound.play('coin', { volume: 1 });
                    }

                    s.destroy();
                }
            });
        }

    }

    coinFall() {
        const coins = ['coin_1', 'coin_3'];

        for (let i = 0; i < 200; i++) {
            const coinKey = Phaser.Math.RND.pick(coins);
            const x = Phaser.Math.Between(0, this.game.config.width);
            const duration = Phaser.Math.Between(1250, 1750);
            const delay = Phaser.Math.Between(100, 1500);
            const sign = Phaser.Math.RND.sign(); // either 1 or -1

            const s = this.add.image(x, -100, coinKey);
            this.f_winFX.add(s);

            // Continuous rotation
            this.tweens.add({
                targets: s,
                angle: `+=${359 * sign}`,
                duration: duration,
                repeat: -1
            });

            // Falling motion
            this.tweens.add({
                targets: s,
                y: 569 * 2 + 50,
                duration: duration,
                ease: 'Quad.easeIn',
                delay: delay,
                repeat: -1
            });
        }

        // this.sound.play('CompleteLevel_Confetti', { volume: 1 });
    }


    starFall(confetti) {
        const duration = Phaser.Math.Between(1250, 1750);
        const delay = 200;

        this.tweens.add({
            targets: confetti,
            y: 569 * 2 + 50,
            duration: duration,
            ease: 'Quad.easeIn',
            delay: delay,
            repeat: 1,
            onComplete: () => {
                confetti.destroy();
            }
        });
    }


    redirect(btn) {
        console.log('UI Redirect:', btn);
        let text = this.add.text(320, 25, 'REDIRECT', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);
        text.alpha = 0;

        this.tweens.add({
            targets: btn,
            scale: '-= 0.1',
            // y: '-= 0.1',
            duration: 150,
            ease: 'Circ',
            yoyo: true,
        });

        this.tweens.add({
            targets: text,
            alpha: 1,
            duration: 150,
            ease: 'Linear',
            yoyo: true,
            hold: 1000,
            delay: 100,
            onComplete: () => {
                text.destroy();
            }
        });
    }

}
