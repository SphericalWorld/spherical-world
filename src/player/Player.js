// @flow strict
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
import { type Entity, type GameObject, World } from '../../common/ecs';
import GlObject from '../engine/glObject';
import playerModel from '../models/player.json';
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
} from '../components';
import type { MaterialLibrary } from '../engine/Material/MaterialLibrary';
import Model from '../engine/Model/Model';
import { COLLIDER_AABB } from '../physicsThread/physics/colliders/AABB';
import type { CreateBlockPicker } from './BlockPicker';

type PlayerData = GameObject<[
  typeof Transform,
  typeof Inventory,
  typeof Camera,
]>;

const createPlayer = (
  ecs: World,
  materialLibrary: MaterialLibrary,
  BlockPicker,
  createTextBillboard,
) => (data: PlayerData, isMainPlayer: boolean = false): Entity => {
  const model = new Model(playerModel, 1.8);
  const material = materialLibrary.get('skybox'); // 'player'
  const player = ecs.createEntity(
    data.id,
    ...[
      Transform.deserialize(data.transform),
      new Collider(
        COLLIDER_AABB,
        vec3.create(),
        vec3.fromValues(0.8, 1.8, 0.8),
        vec3.fromValues(0.4, 0, 0.4),
      ),
      new Physics(),
      new Velocity(),
      new Gravity(),
      Inventory.deserialize(data.inventory),
      ...isMainPlayer
        ? [
          new UserControlled(),
          Camera.deserialize(data.camera),
        ]
        : [
          new Visual(new GlObject({ model, material })),
        ],
    ].filter(el => el),
  );
  createTextBillboard(player.id, vec3.fromValues(0, 2, 0), data.playerData.name);
  const blockPicker = BlockPicker(player);
  player.children.push(blockPicker);

  return player.id;
};


const playerProvider = (
  ecs: World,
  materialLibrary: MaterialLibrary,
  BlockPicker: CreateBlockPicker,
  createTextBillboard,
) => {
  const playerConstructor = createPlayer(ecs, materialLibrary, BlockPicker, createTextBillboard);
  ecs.registerConstructor('PLAYER', playerConstructor);
  return playerConstructor;
};

export default playerProvider;
