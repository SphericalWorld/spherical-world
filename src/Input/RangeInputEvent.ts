import InputEvent from './InputEvent';

export default class RangeInputEvent extends InputEvent {
  x: number;
  y: number;
  z: number;

  constructor(name: string, x = 0, y = 0, z = 0) {
    super(name);
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
