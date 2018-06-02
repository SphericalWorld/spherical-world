import React from 'react';
import { connect } from 'react-redux';

const mapState = (state) => {
  // const { x, y, z } = state.players.instances[state.players.mainPlayerId];
  // const [mouseX, mouseY, mouseZ] = state.mouse.worldPosition;
  //
  // return {
  //   x, y, z, mouseX, mouseY, mouseZ,
  // };
};

const Panel = ({
  x, y, z, mouseX, mouseY, mouseZ,
}) => {
  const $hudApi = {
    player: {
      chunk: {},
    },
  };
  return (
    <div id="hud-debug" ng-show="hudDebugVisible">
      <div>==Debug info==</div>
      <div>Player:</div>
      <div>x: {x}</div>
      <div>y: {y}</div>
      <div>z: {z}</div>
      <div>|</div>
      <div>Chunk:</div>
      <div>x in chunk: {$hudApi.player.chunk.x}</div>
      <div>z in chunk: {$hudApi.player.chunk.z}</div>
      <div>|</div>
      <div>Cursor world position:</div>
      <div>x: {mouseX}</div>
      <div>y: {mouseY}</div>
      <div>z: {mouseZ}</div>
    </div>
  );
};

export default connect(mapState)(Panel);
