import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export const TutorialMode = {
    UNDEFINED: -1,
    NONE: 0,
    CTA: 1,
    CTAs: 2,
};

export class Tutorial extends Scene {
    handTween;
    f_hand;
    handTarget; offset;
    mode;

    constructor() {
        super('Tutorial');
    }

    create() {

        this.f_hand = this.add.image(65, 65, 'debugBtn').setDepth(100).setOrigin(0.1);
        this.f_hand.alpha = 0;

        EventBus.emit('current-scene-ready', this);

        this.setEvents('Game');
        this.setEvents('UI');
        this.setEvents('EM');
        this.setEvents('RM');
    }

    setEvents(sceneName) {
        this.scene.get(sceneName).events.on('setMode', this.setMode, this);
        this.scene.get(sceneName).events.on('queueHand', this.queueHand, this);
        this.scene.get(sceneName).events.on('stopHand', this.stopHand, this);
    }

    setMode(target, mode = TutorialMode.UNDEFINED, offset = null) {
        this.handTarget = target;
        this.mode = mode;
        this.offset = offset ? offset : { x: target.width / 6, y: 20 };
    }

    stopHand(alphaOut = true, nullify = true) {
        this.tweens.killTweensOf([this.f_hand, this.handTarget]);

        this.f_hand.scale = 1;

        if (alphaOut) {
            this.tweens.add({
                targets: this.f_hand,
                alpha: 0,
                duration: 300
            });
        }

        if (nullify) {
            this.handTarget = null;
            this.mode = TutorialMode.NONE;
        }
    }

    queueHand(a = 1, dur = 300, del = 3700) {
        console.log('queueHand', a, dur, del);
        this.stopHand(false, false);
        this.f_hand.setAlpha(0);

        this.handTween = this.tweens.add({
            targets: this.f_hand,
            alpha: a,
            duration: dur,
            delay: del,
            onComplete: () => { this.startTutorial(); },
            onCompleteScope: this,
        });
    }

    startTutorial(target) {
        if (target)
            this.handTarget = target;
        if (!this.handTarget) {
            console.warn('No target set for tutorial');
            return;
        }
        let speed = 1000;

        switch (this.mode) {
            case TutorialMode.NONE:
                // Your logic for no tutorial
                break;
            case TutorialMode.CTAs:
                this.listLogic(speed);
                break;
            default:
                this.ctaLogic(speed);
        }
    }

    listLogic(speed) {
        let index = 0; let target = null;
        let chain = this.tweens.chain({
            targets: null,
            repeat: -1,
            tweens: [
                {
                    targets: this.f_hand,
                    alpha: 1,
                    duration: speed / 4,
                    delay: 100,
                    onStart: () => {
                        target = this.handTarget.getAt(index);
                        let { tx, ty } = target.getWorldTransformMatrix();
                        this.tweens.add({
                            targets: this.f_hand,
                            x: { value: tx + this.offset.x, ease: 'Quad' },
                            y: { value: ty + this.offset.y, ease: 'Linear' },
                            duration: speed / 2,
                        });
                        index = (index + 1) % this.handTarget.length;
                    }
                },
                {
                    targets: this.f_hand,
                    scale: '+=.1',
                    duration: speed / 4,
                    yoyo: true,
                    delay: 50,
                },
                {
                    targets: this.f_hand,
                    scale: '-=.2',
                    duration: speed / 4,
                    yoyo: true,
                    onYoyo: () => {
                        this.tweens.add({
                            targets: target,
                            scale: '-=.1',
                            yoyo: true,
                            ease: 'Quad',
                            duration: speed / 4,
                        });
                        if (target.glow)
                            this.tweens.add({
                                targets: target.glow,
                                alpha: 1,
                                yoyo: true,
                                ease: 'Quad',
                                duration: speed / 2,
                            });
                    }
                }
            ],
        });
    }

    ctaLogic(speed) {
        let { tx, ty } = this.handTarget.getWorldTransformMatrix();
        this.f_hand.setPosition(tx + this.offset.x, ty + this.offset.y);
        this.f_hand.alpha = 1;
        // let ogScale = this.handTarget.scale;
        let counter = -1;

        let t = this.tweens.add({
            targets: this.f_hand,
            scale: '-=.1',
            duration: speed / 2,
            // delay: speed / 3,
            ease: 'Quart',
            repeat: -1,
            repeatDelay: speed / 8,
            yoyo: true,
            // hold: speed / 3,
            onYoyo: () => {
                if (this.mode !== TutorialMode.CTA) return;
                // this.handTarget.scale = ogScale;
                if (counter % 2) {
                    this.tweens.killTweensOf(this.handTarget);
                    this.tweens.add({
                        targets: this.handTarget,
                        scale: '-=.1',
                        duration: speed / 4,
                        // delay: speed / 8,
                        ease: 'Circ',
                        yoyo: true,
                    })
                }
                counter++;
            }
        })
    }
}
