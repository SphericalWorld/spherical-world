// @flow
import type { InputSource } from '../../InputSource';
import RangeInputEvent from '../../RangeInputEvent';
import StateInputEvent, { STATE_UP, STATE_DOWN } from '../../StateInputEvent';
import InputEvent from '../../InputEvent';
import {
  MOUSE_MOVE,
  MOUSE_LEFT_BUTTON,
  MOUSE_MIDDLE_BUTTON,
  MOUSE_RIGHT_BUTTON,
  MOUSE_POINTER_UNLOCKED,
} from './rawEvents';

const keys = [
  MOUSE_LEFT_BUTTON,
  MOUSE_MIDDLE_BUTTON,
  MOUSE_RIGHT_BUTTON,
];

export default class MouseSource implements InputSource {
  onEvent: (event: InputEvent) => any;

  constructor() {
    const canvas = document.getElementById('glcanvas');
    if (!canvas) {
      throw new Error('canvas element not found');
    }
    canvas.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(e), false);
    canvas.addEventListener('mouseup', (e: MouseEvent) => this.onMouseUp(e), false);
    document.addEventListener('mousemove', (e: MouseEvent) => this.onMove(e), false);
    document.addEventListener('pointerlockchange', this.changeTracking.bind(this), false);
    document.addEventListener('mozpointerlockchange', this.changeTracking.bind(this), false);
    document.addEventListener('webkitpointerlockchange', this.changeTracking.bind(this), false);
    document.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault(), false);
  }

  onMove(e: MouseEvent) {
    this.onEvent(new RangeInputEvent(MOUSE_MOVE, e.movementX, e.movementY));
  }

  onMouseDown(e: MouseEvent) {
    this.onEvent(new StateInputEvent(keys[e.button], STATE_DOWN));
  }

  onMouseUp(e: MouseEvent) {
    this.onEvent(new StateInputEvent(keys[e.button], STATE_UP));
  }

  changeTracking() {
    if (!document.pointerLockElement) {
      this.onEvent(new StateInputEvent(MOUSE_POINTER_UNLOCKED));
    }

    // console.log(11, document.pointerLockElement)
  }
}
