import React from 'react';
import { debug } from './debug.module.css';
import type { State } from '../../../reducers/rootReducer';
import { useMemoizedSelector } from '../../../util/reducerUtils';

const mapState = (state: State) => {
  const [x, y, z] = state.hudData.player.position;
  // const [mouseX, mouseY, mouseZ] = state.mouse.worldPosition;
  let chunkX = Math.floor(x % 16);
  let chunkZ = Math.floor(z % 16);
  chunkX = chunkX >= 0 ? chunkX : chunkX + 16;
  chunkZ = chunkZ >= 0 ? chunkZ : chunkZ + 16;

  return {
    x,
    y,
    z,
    chunkX,
    chunkZ,
    mouseX: 0,
    mouseY: 0,
    mouseZ: 0,
  };
};

const DebugPanel = (): JSX.Element => {
  const { x, y, z, chunkX, chunkZ, mouseX, mouseY, mouseZ } = useMemoizedSelector(mapState);
  return (
    <div className={debug}>
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
};

export default DebugPanel;
