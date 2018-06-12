// @flow

export const BACKSPACE: 8 = 8;
export const TAB: 9 = 9;
export const ENTER: 13 = 13;
export const SHIFT: 16 = 16;
export const CTRL: 17 = 17;
export const ALT: 18 = 18;
export const PAUSE_BREAK: 19 = 19;
export const CAPS_LOCK: 20 = 20;
export const ESCAPE: 27 = 27;
export const SPACE: 32 = 32;
export const PAGE_UP: 33 = 33;
export const PAGE_DOWN: 34 = 34;
export const END: 35 = 35;
export const HOME: 36 = 36;
export const LEFT_ARROW: 37 = 37;
export const UP_ARROW: 38 = 38;
export const RIGHT_ARROW: 39 = 39;
export const DOWN_ARROW: 40 = 40;
export const INSERT: 45 = 45;
export const DELETE: 46 = 46;
export const KEY_0: 48 = 48;
export const KEY_1: 49 = 49;
export const KEY_2: 50 = 50;
export const KEY_3: 51 = 51;
export const KEY_4: 52 = 52;
export const KEY_5: 53 = 53;
export const KEY_6: 54 = 54;
export const KEY_7: 55 = 55;
export const KEY_8: 56 = 56;
export const KEY_9: 57 = 57;
export const LEFT_WINDOW_KEY: 91 = 91;
export const RIGHT_WINDOW_KEY: 92 = 92;
export const SELECT_KEY: 93 = 93;
export const NUMPAD_0: 96 = 96;
export const NUMPAD_1: 97 = 97;
export const NUMPAD_2: 98 = 98;
export const NUMPAD_3: 99 = 99;
export const NUMPAD_4: 100 = 100;
export const NUMPAD_5: 101 = 101;
export const NUMPAD_6: 102 = 102;
export const NUMPAD_7: 103 = 103;
export const NUMPAD_8: 104 = 104;
export const NUMPAD_9: 105 = 105;
export const MULTIPLY: 106 = 106;
export const ADD: 107 = 107;
export const SUBTRACT: 109 = 109;
export const DECIMAL_POINT: 110 = 110;
export const DIVIDE: 111 = 111;
export const F1: 112 = 112;
export const F2: 113 = 113;
export const F3: 114 = 114;
export const F4: 115 = 115;
export const F5: 116 = 116;
export const F6: 117 = 117;
export const F7: 118 = 118;
export const F8: 119 = 119;
export const F9: 120 = 120;
export const F10: 121 = 121;
export const F11: 122 = 122;
export const F12: 123 = 123;
export const NUM_LOCK: 144 = 144;
export const SCROLL_LOCK: 145 = 145;
export const SEMI_COLON: 186 = 186;
export const EQUAL_SIGN: 187 = 187;
export const COMMA: 188 = 188;
export const DASH: 189 = 189;
export const PERIOD: 190 = 190;
export const FORWARD_SLASH: 191 = 191;
export const GRAVE_ACCENT: 192 = 192;
export const OPEN_BRACKET: 219 = 219;
export const BACK_SLASH: 220 = 220;
export const CLOSE_BRAKET: 221 = 221;
export const SINGLE_QUOTE: 222 = 222;

const keyboardProvider = store => class Keyboard {
  keyHandlers: Map<number, string> = new Map();
  actions: Map<string, {| onKeyUp?: Function, onKeyDown?: Function |}> = new Map();

  keyStates: { [string]: boolean };

  keyTable = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    'pause/break': 19,
    'caps lock': 20,
    escape: 27,
    space: 32,
    'page up': 33,
    'page down': 34,
    end: 35,
    home: 36,
    'left arrow': 37,
    'up arrow': 38,
    'right arrow': 39,
    'down arrow': 40,
    insert: 45,
    delete: 46,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    'left window key': 91,
    'right window key': 92,
    'select key': 93,
    'numpad 0': 96,
    'numpad 1': 97,
    'numpad 2': 98,
    'numpad 3': 99,
    'numpad 4': 100,
    'numpad 5': 101,
    'numpad 6': 102,
    'numpad 7': 103,
    'numpad 8': 104,
    'numpad 9': 105,
    multiply: 106,
    add: 107,
    subtract: 109,
    'decimal point': 110,
    divide: 111,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    'num lock': 144,
    'scroll lock': 145,
    'semi-colon': 186,
    'equal sign': 187,
    comma: 188,
    dash: 189,
    period: 190,
    'forward slash': 191,
    'grave accent': 192,
    'open bracket': 219,
    'back slash': 220,
    'close braket': 221,
    'single quote': 222,
  };

  constructor() {
    this.keyStates = {};

    this.setKeys();

    window.addEventListener('keydown', (event) => {
      this.keyStates[event.keyCode] = true;
      const actionName = this.keyHandlers.get(event.keyCode);
      if (!actionName) {
        return;
      }
      const action = this.actions.get(actionName);
      if (action && action.onKeyDown) {
        store.dispatch(action.onKeyDown);
      }
    }, true);

    window.addEventListener('keyup', (event) => {
      this.keyStates[event.keyCode] = false;
      const actionName = this.keyHandlers.get(event.keyCode);
      if (!actionName) {
        return;
      }
      const action = this.actions.get(actionName);
      if (action && action.onKeyUp) {
        store.dispatch(action.onKeyUp);
      }
    }, true);
  }

  setKeys() {
    this.setPrimaryKeyForAction('showDebugInfo', 'f2');
    this.setPrimaryKeyForAction('enterFullscreen', 'f9');
    this.setPrimaryKeyForAction('run', 'shift');

    this.setSecondaryKeyForAction('moveForward', 'up arrow');
    this.setSecondaryKeyForAction('moveBack', 'down arrow');
    this.setSecondaryKeyForAction('moveLeft', 'left arrow');
    this.setSecondaryKeyForAction('moveRight', 'right arrow');
  }

  registerAction(action: string, onKeyDown: Function, onKeyUp: Function) {
    this.actions.set(action, { onKeyDown, onKeyUp });
  }

  setPrimaryKeyForAction(actionName: string, key: number | string) {
    const keyCode = typeof key === 'string'
      ? this.keyTable[key]
      : key;

    if (!keyCode) {
      throw new Error('Wrong key provided');
    }
    this.keyHandlers.set(keyCode, actionName);
  }

  setSecondaryKeyForAction(actionName: string, key: number | string) {
    const keyCode = typeof key === 'string'
      ? this.keyTable[key]
      : key;

    if (!keyCode) {
      throw new Error('Wrong key provided');
    }
    this.keyHandlers.set(keyCode, actionName);
  }
};

export default keyboardProvider;
