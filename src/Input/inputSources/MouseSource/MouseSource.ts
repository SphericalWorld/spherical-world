import type { InputSource } from '../../InputSource';
import RangeInputEvent from '../../RangeInputEvent';
import StateInputEvent, { STATE_UP, STATE_DOWN } from '../../StateInputEvent';
import InputEvent from '../../InputEvent';
import {
  MOUSE_MOVE,
  MOUSE_WHEEL_UP,
  MOUSE_WHEEL_DOWN,
  MOUSE_LEFT_BUTTON,
  MOUSE_MIDDLE_BUTTON,
  MOUSE_RIGHT_BUTTON,
  MOUSE_POINTER_UNLOCKED,
} from '../../../../common/constants/input/mouseRawEvents';

const keys = [MOUSE_LEFT_BUTTON, MOUSE_MIDDLE_BUTTON, MOUSE_RIGHT_BUTTON];

export default class MouseSource implements InputSource {
  onEvent: (event: InputEvent) => unknown;
  canvas: HTMLElement;

  constructor() {
    const canvas = document.getElementById('glcanvas');
    if (!canvas) {
      throw new Error('canvas element not found');
    }
    this.canvas = canvas;
    this.setClickHandlers(document, this.canvas);
    document.addEventListener('mousemove', this.onMove, false);
    document.addEventListener('pointerlockchange', this.changeTracking, false);
    document.addEventListener('mozpointerlockchange', this.changeTracking, false);
    document.addEventListener('webkitpointerlockchange', this.changeTracking, false);
    document.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault(), false);
  }

  onMove = (e: MouseEvent): void => {
    this.onEvent(new RangeInputEvent(MOUSE_MOVE, e.movementX, e.movementY));
  };

  onMouseDown = (e: MouseEvent): void => {
    this.onEvent(new StateInputEvent(keys[e.button], STATE_DOWN));
  };

  onMouseUp = (e: MouseEvent): void => {
    this.onEvent(new StateInputEvent(keys[e.button], STATE_UP));
  };

  onMouseWheel = (e: WheelEvent): void => {
    this.onEvent(
      new RangeInputEvent(e.deltaY < 0 ? MOUSE_WHEEL_UP : MOUSE_WHEEL_DOWN, e.deltaX, e.deltaY),
    );
  };

  setClickHandlers = (oldTarget: EventTarget, newTarget: EventTarget): void => {
    oldTarget.removeEventListener('mousedown', this.onMouseDown);
    oldTarget.removeEventListener('mouseup', this.onMouseUp);
    oldTarget.removeEventListener('wheel', this.onMouseWheel);
    newTarget.addEventListener('mousedown', this.onMouseDown, false);
    newTarget.addEventListener('mouseup', this.onMouseUp, false);
    newTarget.addEventListener('wheel', this.onMouseWheel, false);
  };

  changeTracking = (): void => {
    if (document.pointerLockElement) {
      this.setClickHandlers(this.canvas, document);
    } else {
      this.setClickHandlers(document, this.canvas);
      this.onEvent(new StateInputEvent(MOUSE_POINTER_UNLOCKED));
    }
  };
}
