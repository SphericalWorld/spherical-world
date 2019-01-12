// @flow strict

const socketHandlersProvider = Player => class SocketHandlers {
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
