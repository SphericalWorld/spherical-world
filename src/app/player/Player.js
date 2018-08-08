// @flow
// import GlObject from '../engine/glObject';
// import { connect } from '../util';
// import { loadPlayer } from './playerActions';
// import { gl } from '../engine/glEngine';
//
// // import BlockPicker from './BlockPicker';
//
// function mapState(store, player) {
//   const {
//     x, y, z, horizontalRotate, verticalRotate,
//   } = store.players.instances[player.id];
//   return {
//     x, y, z, horizontalRotate, verticalRotate,
//   };
// }
//
// const mapActions = () => ({
//   loadPlayer,
// });
//
// const playerProvider = (store, BlockRemover, BlockPicker, Inventory) => {
//   @connect(mapState, mapActions, store)
//   class Player {
//     loadPlayer: typeof loadPlayer;
//
//     id: number;
//     x: number = 0.0;
//     y: number = 0.0;
//     z: number = 0.0;
//     horizontalRotate: number = 0.0;
//     verticalRotate: number = 0.0;
//     movingForward: boolean = false;
//     movingBack: boolean = false;
//     movingLeft: boolean = false;
//     movingRight: boolean = false;
//     name: string;
//
//     blockRemover: BlockRemover;
//     inventory: Inventory;
//
//     static instances = [];

//     static addToPlayers(player: Player) {
//       this.instances[player.id] = player;
//     }
//
//     constructor(params, app) {
//       this.app = app;
//       this.speed = 0.006;
//       this.currentSpeed = 0;
//       this.running = false;
//       this.jumping = false;
//       this.blockRemovingSpeed = 2;
//       this.blockInDown = 0;
//       this.blockInUp = 0;
//
//       this.fallSpeed = 0;
//       if (typeof params === 'object') {
//         Object.assign(this, params);
//       }
//       this.constructor.addToPlayers(this);
//       this.name = 'unnamed player';
//
//       this.level = 3;
//       this.exp = 200;
//       this.expForLevel = 250;
//       this.maxHp = 10000;
//       this.hp = 7500;
//       this.mana = 6500;
//       this.maxMana = 10000;
//       this.inventory = new Inventory();
//
//       this.selectedItem = this.inventory.items[0].slots[7];
//
//       this.hudBillboard = new GlObject({ material: 'qwe'});
//       this.hudBillboard.model = Player.hudBillboardModel;
//
//       if (!this.mainPlayer) {
//         this.glObject = new GlObject({ material: 'qwe'});
//         this.glObject.model = Player.model;
//         this.glObject.texture = Player.texture;
//       }
//
//       setInterval(() => {
//         this.exp += 1;
//         if (this.exp === this.expForLevel) {
//           this.exp = 0;
//         }
//       }, 200);
//
//       this.textureLibrary = app.textureLibrary;
//       this.nicknameTexture = this.textureLibrary.makeTextureFromText(this.name);
//       this.hudBillboard.texture = this.nicknameTexture;
//       this.loadPlayer({
//         x: this.x,
//         y: this.y,
//         z: this.z,
//         speed: this.speed,
//         currentSpeed: this.currentSpeed,
//         movingForward: this.movingForward,
//         movingBack: this.movingBack,
//         movingLeft: this.movingLeft,
//         movingRight: this.movingRight,
//         horizontalRotate: this.horizontalRotate,
//         verticalRotate: this.verticalRotate,
//         fallSpeed: this.fallSpeed,
//         id: this.id,
//         running: this.running,
//       }, this.mainPlayer);
//       this.blockRemover = new BlockRemover();
//       this.blockPicker = new BlockPicker();
//     }
//
//     putBlock(geoId, x, y, z, plane) {
//       if (this.selectedItem.count > 0) {
//         this.selectedItem.count--;
//         if (this.selectedItem.count === 0) {
//           delete this.selectedItem;
//         }
//       }
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
//
//     destroy() {
//       clearInterval(this.removingInterval);
//       clearTimeout(this.removingTimeout);
//       delete this.constructor.instances[this.id];
//     }
//   }
//
//   return Player;
// };
//
// export default playerProvider;

import { vec3 } from 'gl-matrix';
import type { Entity } from '../ecs/Entity';
import Collider from '../components/Collider';
import UserControlled from '../components/UserControlled';
import GlObject from '../engine/glObject';
import Model, { CUBE } from '../engine/Model';
import { World } from '../ecs';
import {
  Transform, Camera, Physics, Velocity, Gravity, Raytracer,
} from '../components';
import { MaterialLibrary } from '../engine/MaterialLibrary';
import { COLLIDER_AABB } from '../physicsThread/physics/colliders/AABB';

const playerProvider = (
  ecs: World,
  materialLibrary: MaterialLibrary,
  BlockPicker,
  Inventory,
) => (data: Object): Entity => {
  const model = Model.createPrimitive(CUBE, 1.001);
  const material = materialLibrary.get('blockSelector'); // 'player'
  const object = new GlObject({ model, material });
  const blockPicker = BlockPicker();
  return ecs.createEntity(
    data.id,
    new Transform(data.x, data.y, data.z),
    new Camera(),
    new Collider(COLLIDER_AABB, vec3.create(), vec3.fromValues(0.8, 1.8, 0.8)), // 1.8
    new Physics(),
    new Velocity(),
    new Gravity(),
    new UserControlled(),
    // new Visual(object),
    new Raytracer(),
  );
};

export default playerProvider;
