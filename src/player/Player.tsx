// const playerProvider = (store, BlockRemover, BlockPicker) => {
//   class Player {
//     name: string;
//     constructor(params, app) {
//       this.blockRemovingSpeed = 2;
//
//       this.level = 3;
//       this.exp = 200;
//       this.expForLevel = 250;
//       this.maxHp = 10000;
//       this.hp = 7500;
//       this.mana = 6500;
//       this.maxMana = 10000;
//       setInterval(() => {
//         this.exp += 1;
//         if (this.exp === this.expForLevel) {
//           this.exp = 0;
//         }
//       }, 200);
//     }
//
//   return Player;
// };
//
// export default playerProvider;

import { vec3 } from 'gl-matrix';
import type { Entity } from '../../common/ecs';
import { GameObject, World, React } from '../../common/ecs';
import playerModel from '../models/player.json';
import type { TransformProps, InventoryProps } from '../components/react';
import {
  Transform,
  Camera,
  Collider,
  Physics,
  Velocity,
  Gravity,
  UserControlled,
  Visual,
  Inventory,
  Script,
} from '../components/react';
import Model from '../engine/Model';
import { COLLIDER_AABB } from '../physicsThread/physics/colliders/AABB';
import { TextBillboard } from '../gameObjects';
import { BlockPicker } from './BlockPicker';
import { materialLibrary, GlObject } from '../engine';
import { Sound } from '../Sound';
import { getBlock } from '../../common/terrain';
import type Terrain from '../Terrain';
import { blocksFlags, HAS_PHYSICS_MODEL, blocksInfo } from '../blocks/blockInfo';
import type { UserControlled as CUserControlled, Transform as CTransform } from '../components';
import { PlayerHands } from './PlayerHands';

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
  movementData: CUserControlled = null;
  transform: CTransform = null;

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
        if (blocksFlags[block][HAS_PHYSICS_MODEL]) {
          this.footsteps[block].play();
          this.deltaMove = 0;
        }
      }
    }
  }
}

export const PlayerScriptComponent = (): JSX.Element => new PlayerScript();

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
      {/* <transform qwe="asd" /> */}
      <Transform {...transform} />
      <Collider
        type={COLLIDER_AABB}
        params={[vec3.create(), vec3.fromValues(0.8, 1.8, 0.8), vec3.fromValues(0.4, 0, 0.4)]}
      />
      <Physics />
      <Velocity />
      <Gravity />
      <PlayerScriptComponent />
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

const playerProvider = (ecs: World, terrain: Terrain) => {
  ecs.registerConstructor('PLAYER', Player);
  PlayerScript.terrain = terrain;
  // ecs.registerComponentTypes(PlayerScript);
};

export default playerProvider;
