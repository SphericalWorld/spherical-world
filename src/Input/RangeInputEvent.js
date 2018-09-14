// @flow
import InputEvent from './InputEvent';

export default class RangeInputEvent extends InputEvent {
  x: number;
  y: number;
  z: number;

  constructor(name: string, x: number = 0, y: number = 0, z: number = 0) {
    super(name);
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
