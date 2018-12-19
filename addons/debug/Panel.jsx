// @flow strict
import React from 'react';
import { connect } from 'react-redux';

const mapState = (state) => {
  const [x, y, z] = state.hudData.player.position;
  // const [mouseX, mouseY, mouseZ] = state.mouse.worldPosition;
  let chunkX = Math.floor(x % 16);
  let chunkZ = Math.floor(z % 16);
  chunkX = chunkX >= 0 ? chunkX : chunkX + 16;
  chunkZ = chunkZ >= 0 ? chunkZ : chunkZ + 16;

  return {
    x, y, z, chunkX, chunkZ, mouseX: 0, mouseY: 0, mouseZ: 0,
  };
};

type Props = {|
  +x: number;
  +y: number;
  +z: number;
  +chunkX: number;
  +chunkZ: number;
  +mouseX: number;
  +mouseY: number;
  +mouseZ: number;
|}

const Panel = ({
  x, y, z, chunkX, chunkZ, mouseX, mouseY, mouseZ,
}: Props) => (
  <div id="hud-debug" ng-show="hudDebugVisible">
    <div>==Debug info==</div>
    <div>Player:</div>
    <div>
      x:
      {x}
    </div>
    <div>
      y:
      {y}
    </div>
    <div>
      z:
      {z}
    </div>
    <div>|</div>
    <div>Chunk:</div>
    <div>
      x in chunk:
      {chunkX}
    </div>
    <div>
      z in chunk:
      {chunkZ}
    </div>
    <div>|</div>
    <div>Cursor world position:</div>
    <div>
      x:
      {mouseX}
    </div>
    <div>
      y:
      {mouseY}
    </div>
    <div>
      z:
      {mouseZ}
    </div>
  </div>
);

export default connect(mapState)(Panel);
