// import Player from './player/Player';

const socketHandlersProvider = Player => class SocketHandlers {
  constructor(app, network) {
    this.app = app;
    this.network = network;
    // this.network.route('LOAD_OTHER_PLAYER', this.loadOtherPlayer.bind(this));
    // this.network.route('OTHER_PLAYER_CHANGE_POSITION', this.otherPlayerChangePosition.bind(this));
    // this.network.route('OTHER_PLAYER_CHANGE_ROTATION', this.otherPlayerChangeRotation.bind(this));
    // this.network.route('OTHER_PLAYER_DISCONNECT', this.otherPlayerDisconnect.bind(this));
    // this.network.route('OTHER_PLAYER_START_REMOVE_BLOCK', this.otherPlayerStartRemoveBlock.bind(this));
    // this.network.route('OTHER_PLAYER_STOP_REMOVE_BLOCK', this.otherPlayerStopRemoveBlock.bind(this));
  }

  loadOtherPlayer(data) {
    new Player(data, this.app);
  }

  otherPlayerChangePosition(data) {
    // Player.instances[data.id].x = data.x;
    // Player.instances[data.id].y = data.y;
    // Player.instances[data.id].z = data.z;

    const deltaX = data.x - Player.instances[data.id].x;
    const deltaY = data.y - Player.instances[data.id].y;
    const deltaZ = data.z - Player.instances[data.id].z;

    let iters = 0;
    var interval = setInterval(() => {
      if (!Player.instances[data.id]) {
        clearInterval(interval);
      } else {
        // Player.instances[data.id].glObject.horizontalRotate = Player.instances[data.id].glObject.horizontalRotate+iters*delta/3;
        Player.instances[data.id].x += deltaX / 6;
        Player.instances[data.id].y += deltaY / 6;
        Player.instances[data.id].z += deltaZ / 6;
        iters++;
        if (iters >= 6) {
          clearInterval(interval);
        }
      }
    }, 1000 / 120);
  }

  otherPlayerChangeRotation(data) {
    Player.instances[data.id].glObject.verticalRotate = data.v;
    // window.Player.instances[data.id].glObject.horizontalRotate = data.h+3.14159265/2;
    const delta = data.h + 3.14159265 / 2 - Player.instances[data.id].glObject.horizontalRotate;
    let iters = 0;
    var interval = setInterval(() => {
      if (!Player.instances[data.id]) {
        clearInterval(interval);
      } else {
        Player.instances[data.id].glObject.horizontalRotate += delta / 6;
        iters++;
        if (iters >= 6) {
          clearInterval(interval);
        }
      }
    }, 1000 / 120);
  }

  otherPlayerDisconnect(data) {
    Player.instances[data.id].destroy();
  }

  otherPlayerStartRemoveBlock(data) {
    Player.instances[data.id].blockRemover.x = data.x;
    Player.instances[data.id].blockRemover.y = data.y;
    Player.instances[data.id].blockRemover.z = data.z;
    Player.instances[data.id].startRemovingBlock();
  }

  otherPlayerStopRemoveBlock(data) {
    Player.instances[data.id].stopRemovingBlock();
  }
};

export default socketHandlersProvider;
