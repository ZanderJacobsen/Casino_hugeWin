import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
    f_bg; f_pile;
    f_spinBoard;

    constructor() {
        super('Game');
    }

    create() {
        this.f_bg = this.add.image(320, 569, 'background_portrait');
        this.f_pile = this.add.image(320, 1039, 'moneypile_portrait');
        // this.cameras.main.setBackgroundColor(0x333333);

        // this.add.image(512, 384, 'background').setAlpha(0.5);

        EventBus.emit('current-scene-ready', this);
    }

    // Work on game objects at each game step
    update(time, delta) {

    }

    changeScene() {
        this.scene.run('EM');
        this.scene.stop('UI');
        this.scene.stop();
    }
}
