import { EventBus } from '../EventBus';

export class SpinBoard extends Phaser.GameObjects.Container {
  constructor(scene, x, y, children) {
    super(scene, x, y, children);

    this.scene = scene;
    this.x = x;
    this.y = y;
    // Example: add internal elements here
    // const bg = scene.add.rectangle(0, 0, 100, 50, 0x000000);
    // this.add(bg);

    // Optional: hook up interaction or animations
    // this.setInteractive();

    // this.on('pointerdown', () => {
    //   EventBus.emit('barClicked');
    // });
    this.scene.add.existing(this);
  }
}