import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x333333);

        // this.add.image(512, 384, 'background').setAlpha(0.5);

        EventBus.emit('current-scene-ready', this);
    }

    // Work on game objects at each game step
    update(time, delta) 
    {

    }

    changeScene ()
    {
        this.scene.run('EM');
        this.scene.stop('UI');
        this.scene.stop();
    }
}
