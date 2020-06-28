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
} from '../components/react';
import Model from '../engine/Model';
import { COLLIDER_AABB } from '../physicsThread/physics/colliders/AABB';
import { TextBillboard } from '../gameObjects';
import { BlockPicker } from './BlockPicker';
import { materialLibrary, GlObject } from '../engine';

type Props = {
  id: Entity;
  transform: TransformProps;
  inventory: InventoryProps;
  playerData: any;
  isMainPlayer: boolean;
};

export const Player = ({
  id,
  transform,
  inventory,
  playerData,
  camera,
  isMainPlayer = false,
}: Props): JSX.Element => {
  const model = new Model(playerModel, 1.8);
  const material = materialLibrary.get('skybox'); // 'player'
  //
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
      <Inventory {...inventory.data} />
      {isMainPlayer
        ? [<UserControlled />, <Camera {...camera} />]
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

const playerProvider = (ecs: World) => {
  ecs.registerConstructor('PLAYER', Player);
};

export default playerProvider;
