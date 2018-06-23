// @flow
import { mousePress, mouseRelease } from './mouseActions';
import { playerStartRemoveBlock, playerStopRemoveBlock, playerPlaceBlock } from '../player/playerActions';

const mouseProvider = () => {
  class Mouse {
    playerStartRemoveBlock: typeof playerStartRemoveBlock;
    playerStopRemoveBlock: typeof playerStopRemoveBlock;
    playerPlaceBlock: typeof playerPlaceBlock;
    mousePress: typeof mousePress;
    mouseRelease: typeof mouseRelease;

    playerId: number;
    locked: boolean;

    constructor() {
      this.wheelHandlers = [];
      document.addEventListener('mousedown', this.mouseDown.bind(this), false);
      document.addEventListener('mouseup', this.mouseUp.bind(this), false);
      document.addEventListener('wheel', this.mouseWheel.bind(this), false);
    }

    mouseDown(e: MouseEvent) {
      this.mousePress({ button: e.button });
      if (this.locked) {
        if ((e.button === this.keyTable.left) && this.geoId) {
          this.playerStartRemoveBlock(this.playerId);
        } else if ((e.button === this.keyTable.right) && this.emptyBlockChunkId) {
          this.playerPlaceBlock(this.playerId);
        }
      }
    }

    mouseUp(e: MouseEvent) {
      this.mouseRelease({ button: e.button });
      if (this.locked) {
        if ((e.button === this.keyTable.left) && this.geoId) {
          this.playerStopRemoveBlock(this.playerId);
        }
      }
    }

    mouseWheel(e: WheelEvent) {
      for (let i = 0; i < this.wheelHandlers.length; i++) {
        this.wheelHandlers[i](e.wheelDelta);
      }
      e.preventDefault();
    }

    onWheel(handler) {
      this.wheelHandlers.push(handler);
    }
  }

  Mouse.prototype.keyTable = {
    left: 0,
    middle: 1,
    right: 2,
  };

  return Mouse;
};

export default mouseProvider;
