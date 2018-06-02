// @flow
import { mousePress, mouseRelease } from './mouseActions';
import { playerStartRemoveBlock, playerStopRemoveBlock, playerPlaceBlock } from '../player/playerActions';

const mapState = state => ({
  playerId: state.players.mainPlayerId,
  geoId: state.raytracer.geoId,
  emptyBlockChunkId: state.raytracer.emptyBlockChunkId,
  locked: state.mouse.locked,
});

const mapActions = () => ({
  playerStartRemoveBlock,
  playerStopRemoveBlock,
  playerPlaceBlock,
  mousePress,
  mouseRelease,
});

const mouseProvider = (store) => {
  class Mouse {
    playerStartRemoveBlock: typeof playerStartRemoveBlock;
    playerStopRemoveBlock: typeof playerStopRemoveBlock;
    playerPlaceBlock: typeof playerPlaceBlock;
    mousePress: typeof mousePress;
    mouseRelease: typeof mouseRelease;

    playerId: number;
    body: HTMLElement = document.getElementsByTagName('body')[0];
    locked: boolean;

    constructor() {
      this.wheelHandlers = [];
      document.addEventListener('mousedown', this.mouseDown.bind(this), false);
      document.addEventListener('mouseup', this.mouseUp.bind(this), false);
      document.addEventListener('wheel', this.mouseWheel.bind(this), false);
      document.addEventListener('contextmenu', this.onContextMenu.bind(this), false);
    }
    // eslint-disable-next-line class-methods-use-this
    onContextMenu(e: MouseEvent): void {
      e.preventDefault();
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
