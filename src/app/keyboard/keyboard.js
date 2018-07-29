// @flow

const keyboardProvider = () => class Keyboard {
  keyHandlers: Map<number, string> = new Map();

  constructor() {
    this.setKeys();
  }

  setKeys() {
    this.setPrimaryKeyForAction('showDebugInfo', 'f2');
    this.setPrimaryKeyForAction('enterFullscreen', 'f9');
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
