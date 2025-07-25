import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { CTA } from '../prefabs/CTA'

export class EM extends Scene {
    f_overlay;
    f_modal; f_downloadBox; f_realClash; f_sweeps;
    f_cta; f_emText;

    constructor() {
        super('EM');
    }

    create() {
        this.f_overlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, // Color (black)
            0.5 // Alpha (0 = transparent, 1 = opaque)
        );

        this.f_downloadBox = this.add.image(0, 0, 'download_box');
        this.f_realClash = this.add.image(0, -55, 'download_realcash');
        this.f_sweeps = this.add.image(0, 85, 'download_sweeps');
        this.f_emText = this.add.text(0, -150, 'DOWNLOAD FOR\nA CHANCE TO WIN', {
            fontFamily: 'Arial Black', fontSize: 40, color: '#ffffff',
            stroke: '#000000', strokeThickness: 1,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.f_cta = new CTA(this, 0, 250);

        // For readability
        let arr = [this.f_downloadBox, this.f_realClash, this.f_sweeps, this.f_cta, this.f_emText];
        this.f_modal = this.add.container(320, 569, arr).setDepth(100);

        EventBus.emit('current-scene-ready', this);
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
        this.scene.start('RM');
    }
}
