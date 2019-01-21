// @flow strict
// const playerProvider = (store, BlockRemover, BlockPicker) => {
//   @connect(mapState, mapActions, store)
//   class Player {
//     name: string;
//     constructor(params, app) {
//       this.blockRemovingSpeed = 2;
//
//       this.fallSpeed = 0;
//       this.name = 'unnamed player';
//
//       this.level = 3;
//       this.exp = 200;
//       this.expForLevel = 250;
//       this.maxHp = 10000;
//       this.hp = 7500;
//       this.mana = 6500;
//       this.maxMana = 10000;
//
//       this.hudBillboard = new GlObject({ material: 'qwe'});
//       this.hudBillboard.model = Player.hudBillboardModel;
//
//       setInterval(() => {
//         this.exp += 1;
//         if (this.exp === this.expForLevel) {
//           this.exp = 0;
//         }
//       }, 200);
//
//       this.nicknameTexture = this.textureLibrary.makeTextureFromText(this.name);
//       this.hudBillboard.texture = this.nicknameTexture;
//     }
//
//     drawHud() {
//       if (this.hudBillboard) {
//         gl.enable(gl.BLEND);
//         gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//
//         this.hudBillboard.x = this.x;
//         this.hudBillboard.y = this.y + 1.2;
//         this.hudBillboard.z = this.z;
//         this.hudBillboard.draw();
//         gl.disable(gl.BLEND);
//       }
//     }
//   }
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

type playerData = GameObject<[
  typeof Transform,
  typeof Inventory,
  typeof Camera,
]>;

const createPlayer = (
  ecs: World,
  materialLibrary: MaterialLibrary,
  BlockPicker,
) => (data: playerData, isMainPlayer: boolean = false): Entity => {
  const model = new Model(playerModel, 2);
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

  const blockPicker = BlockPicker(player);
  player.children.push(blockPicker);

  return player.id;
};


const playerProvider = (
  ecs: World,
  materialLibrary: MaterialLibrary,
  BlockPicker: CreateBlockPicker,
) => {
  const playerConstructor = createPlayer(ecs, materialLibrary, BlockPicker);
  ecs.registerConstructor('PLAYER', playerConstructor);
  return playerConstructor;
};

export default playerProvider;
