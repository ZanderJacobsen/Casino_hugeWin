import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { CTA } from '../prefabs/CTA'

export class RM extends Scene {
    f_bg;
    f_logo; f_wrapper; f_cta; f_text;
    f_coins; f_radial;

    constructor() {
        super('RM');
    }

    create() {
        // this.cameras.main.setBackgroundColor(0x330000);

        this.f_bg = this.add.image(320, 569, 'background_portrait');

        this.f_logo = this.add.image(320, 319, 'logo').setDepth(100);
        this.f_text = this.add.text(320, 539, 'REAL WINNERS!', {
            fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
            stroke: '#0080c0', strokeThickness: 12,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.f_cta = new CTA(this, 0, 0);

        this.f_logo.setInteractive();
        this.f_logo.on('pointerdown', () => this.redirect());

        this.f_coins = this.add.image(320, 1069, 'coins_rm');
        this.f_radial = this.add.image(0, 0, 'radial').setScale(2).setAlpha(0.5);

        this.f_wrapper = this.add.container(320, 719, [this.f_radial, this.f_cta]).setDepth(100);

        EventBus.emit('current-scene-ready', this);

        // this.events.emit('setMode', this.f_cta, 1);
        // this.events.emit('queueHand', 0, 200, 300);
    }

    redirect(btn) {
        console.log('RM Redirect:', btn);
        let text = this.add.text(320, 25, 'REDIRECT', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);
        text.alpha = 0;

        if (btn) {
            this.tweens.add({
                targets: btn,
                scale: '-= 0.1',
                // y: '-= 0.1',
                duration: 150,
                ease: 'Circ',
                yoyo: true,
            });
        }

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

    changeScene() {
        this.events.emit('stopHand');
        this.scene.start('UI');
    }
}
