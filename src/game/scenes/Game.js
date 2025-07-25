import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { SpinBoard } from '../prefabs/SpinBoard';
import { CTA } from '../prefabs/CTA'

export class Game extends Scene {
    f_bg; f_pile;
    f_spinBoard; f_spin;

    constructor() {
        super('Game');
    }

    create() {
        this.f_bg = this.add.image(320, 569, 'background_portrait');
        this.f_pile = this.add.image(320, 1039, 'moneypile_portrait');
        // this.cameras.main.setBackgroundColor(0x333333);

        this.f_spin = new CTA(this, 320, 919);
        this.f_spin.enableBtn();
        this.f_spin.showSparkles(75);
        this.f_spin.loopArrows();

        this.f_spinBoard = new SpinBoard(this, 320, 639);

        this.events.on('spinBoardMatch', arg => { this.boardCheck(arg); });

        this.f_spin.f_gray.setInteractive();
        this.f_spin.f_gray.on('pointerdown', () => {
            this.f_spin.f_gray.disableInteractive();
            this.f_spin.disableBtn(false, true);
            this.f_spinBoard.activate();
        });

        EventBus.emit('current-scene-ready', this);

        this.scene.get('UI').events.on('AttaboyDone', () => { this.resetStuff(); })
    }

    resetStuff() {
        this.f_spinBoard.backToBasics(true);

        this.events.on('spinBoardReset', () => {
            this.f_spin.f_gray.setInteractive();
            this.f_spin.enableBtn();
        });
    }

    boardCheck(phase) {
        switch (phase) {
            case 0:
            case 2:
                this.events.emit('showAttaboy');
                break;
            case 1:
                this.events.emit('MeterUpdate', 50);
                this.time.delayedCall(1000, () => {
                    this.f_spinBoard.backToBasics(true);
                    this.events.once('spinBoardReset', () => {
                        this.f_spin.enableBtn();
                    });
                });
                break;
            default:
                console.warn('NO LOGIC')
        }

    }

    // Work on game objects at each game step
    update(time, delta) {
        this.f_spinBoard.update(time, delta);
    }

    changeScene() {
        this.scene.run('EM');
        // this.scene.stop('UI');
        // this.scene.stop();
    }
}
