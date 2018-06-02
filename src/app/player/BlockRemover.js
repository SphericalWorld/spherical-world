// @flow
// import GlObject from '../engine/glObject';
// import Model from '../engine/Model';
// import { connect } from '../util';
// import { terrainRemoveBlock } from '../Terrain/terrainActions';
// import { MOUSE_BUTTON_LEFT } from '../mouse/mouseConstants';
// import { Position } from '../components';

// const mapState = (state, blockRemover) => {
//   const {
//     block: { x, y, z },
//     geoId,
//     blockInChunk,
//   } = state.raytracer;
//   const {
//     removingBlock,
//   } = state.players.instances[blockRemover.id];
//   const {
//     [MOUSE_BUTTON_LEFT]: mouseLeftPressed,
//   } = state.mouse.buttons;
//   return {
//     geoId, x, y, z, removingBlock, blockInChunk, mouseLeftPressed,
//   };
// };
//
// const mapActions = () => ({
//   terrainRemoveBlock,
// });
//
// const blockRemoverProvider = (store, materialLibrary) => {
//   @connect(mapState, mapActions, store)
//   class BlockRemover extends GlObject {
//     id: number;
//     visible: boolean = false;
//     textureIndex: number;
//     textureFramesCount = 10;
//     intervalDescriptor: number;
//
//     constructor(id: number, app) {
//       super({ material: 'qwe'});
//       this.id = id;
//       this.model = Model.createPrimitive('cube', 1.001);
//       this.app = app;
//     }
//
//     draw() {
//       this.material = materialLibrary.get('blockRemover');
//       this.material.use();
//       super.draw()
//     }
//
//     startRemoveBlock(blockRemovingSpeed: number): void {
//       this.visible = true;
//       this.textureIndex = 0;
//
//       const timeToRemove = 1000 / blockRemovingSpeed;
//       const intervalSize = timeToRemove / this.textureFramesCount;
//       let intervalsLeft = this.textureFramesCount;
//       this.intervalDescriptor = setInterval(() => {
//         this.textureIndex += 1;
//         intervalsLeft -= 1;
//         // this.texture = this.app.textures.blockDamage.glTexture[this.textureIndex];
//
//         if (!intervalsLeft) {
//           clearInterval(this.intervalDescriptor);
//           this.terrainRemoveBlock(this.geoId, this.id, this.blockInChunk.x, this.blockInChunk.y, this.blockInChunk.z);
//         }
//       }, intervalSize);
//     }
//
//     stopRemoveBlock() {
//       this.visible = false;
//       clearInterval(this.intervalDescriptor);
//     }
//
//     componentDidUpdate(prevState: BlockRemover) {
//       if (!prevState.removingBlock && this.removingBlock) {
//         this.startRemoveBlock(2);
//       } else if (prevState.removingBlock && !this.removingBlock) {
//         this.stopRemoveBlock();
//       } else if (prevState.removingBlock && this.removingBlock) {
//         const changed = (this.x !== prevState.x) || (this.y !== prevState.y) || (this.z !== prevState.z);
//         if (changed) {
//           this.stopRemoveBlock();
//           if (this.mouseLeftPressed) {
//             this.startRemoveBlock(2);
//           }
//         }
//       }
//     }
//   }
//   return BlockRemover;
// };

import type { Entity } from '../ecs/Entity';
import GlObject from '../engine/glObject';
import Model, { CUBE } from '../engine/Model';
import { World } from '../ecs';
import { Transform, Visual, Raytracer } from '../components';
import { MaterialLibrary } from '../engine/MaterialLibrary';

const blockRemoverProvider = (
  ecs: World,
  materialLibrary: MaterialLibrary,
) => (id: Entity): Entity => {
  const model = Model.createPrimitive(CUBE, 1.001);
  const material = materialLibrary.get('blockRemover');
  const object = new GlObject({ model, material });
  return ecs.createEntity(
    id,
    new Transform(0, 64, 0),
    new Visual(object),
    new Raytracer(),
  );
};

export default blockRemoverProvider;
