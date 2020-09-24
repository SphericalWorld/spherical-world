import { vec3 } from 'gl-matrix';
import type { Entity } from '../../common/ecs';
import { GameObject, React } from '../../common/ecs';
import playerModel from '../models/player.json';
import type { TransformProps, InventoryProps } from '../components/react';
import {
  Camera,
  Collider,
  Physics,
  Velocity,
  Gravity,
  UserControlled,
  Visual,
  Inventory,
  Script,
  Transform,
} from '../components';
import Model from '../engine/Model';
import { COLLIDER_AABB } from '../physicsThread/physics/colliders/AABB';
import { TextBillboard } from '../gameObjects';
import { BlockPicker } from './BlockPicker';
import { materialLibrary, GlObject } from '../engine';
import { Sound } from '../Sound';
import { getBlock } from '../../common/terrain';
import type Terrain from '../Terrain';
import { blocksInfo } from '../blocks/blocksInfo';

import { PlayerHands } from './PlayerHands';
import type { WorldMainThread } from '../Events';

type Props = {
  id: Entity;
  transform: TransformProps;
  inventory: InventoryProps;
  playerData: any;
  isMainPlayer: boolean;
};

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       transform: { qwe: number };
//     }
//   }
// }

const tmp = vec3.create();

class PlayerScript extends Script {
  static terrain: Terrain;

  footsteps = blocksInfo.map(
    (block) =>
      new Sound({
        src: block.sounds?.footsteps,
        volume: 0.04,
        lazy: true,
      }),
  );

  lastPosition = vec3.create();
  deltaMove = 0;
  movementData: UserControlled = null;
  transform: Transform = null;

  start() {
    this.movementData = this.gameObject.get('userControlled');
    this.transform = this.gameObject.get('transform');
  }

  update() {
    const { movementData, transform } = this;

    this.deltaMove += vec3.length(vec3.sub(tmp, transform.translation, this.lastPosition));
    vec3.copy(this.lastPosition, transform.translation);

    if (movementData.velocity[0] || movementData.velocity[1]) {
      if (this.deltaMove >= 3 && transform.translation[1] % 1 < 0.1) {
        const { translation } = transform;

        const block = getBlock(PlayerScript.terrain)(
          translation[0],
          translation[1] - 1,
          translation[2],
        );
        if (blocksInfo[block].needPhysics) {
          this.footsteps[block].play();
          this.deltaMove = 0;
        }
      }
    }
  }
}

export const Player = ({
  id,
  transform,
  inventory,
  playerData,
  camera,
  isMainPlayer = false,
}: Props): JSX.Element => {
  const model = new Model(playerModel, 1.8);
  const material = materialLibrary.get('player'); // 'player'

  return (
    <GameObject id={id}>
      <Transform {...transform} />
      <Collider
        type={COLLIDER_AABB}
        params={[vec3.create(), vec3.fromValues(0.8, 1.8, 0.8), vec3.fromValues(0.4, 0, 0.4)]}
      />
      <Physics />
      <Velocity />
      <Gravity />
      <PlayerScript />
      <Inventory {...inventory.data} />
      {isMainPlayer
        ? [<UserControlled />, <Camera {...camera} />, <PlayerHands parent={id} />]
        : [
            <Visual object={new GlObject({ model, material })} />,
            <TextBillboard
              parent={id}
              position={vec3.fromValues(0, 2, 0)}
              text={playerData.name}
            />,
          ]}
      <BlockPicker parent={id} />
    </GameObject>
  );
};

const playerProvider = (ecs: WorldMainThread, terrain: Terrain) => {
  ecs.registerConstructor('PLAYER', Player);
  PlayerScript.terrain = terrain;
  // ecs.registerComponentTypes(PlayerScript);
};

export default playerProvider;
