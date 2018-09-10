// @flow

const socketHandlersProvider = Player => class SocketHandlers {
  otherPlayerChangeRotation(data) {
    Player.instances[data.id].glObject.verticalRotate = data.v;
    // window.Player.instances[data.id].glObject.horizontalRotate = data.h+3.14159265/2;
    const delta = data.h + 3.14159265 / 2 - Player.instances[data.id].glObject.horizontalRotate;
    let iters = 0;
    const interval = setInterval(() => {
      if (!Player.instances[data.id]) {
        clearInterval(interval);
      } else {
        Player.instances[data.id].glObject.horizontalRotate += delta / 6;
        iters += 1;
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
