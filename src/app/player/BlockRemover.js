// @flow
// import { connect } from '../util';
// import { terrainRemoveBlock } from '../Terrain/terrainActions';
// const mapActions = () => ({
//   terrainRemoveBlock,
// });
//
// const blockRemoverProvider = (store, materialLibrary) => {
//   @connect(mapState, mapActions, store)
//   class BlockRemover extends GlObject {
//     id: number;
//     visible: boolean = false;
//
//     constructor(id: number, app) {
//       this.id = id;
//       this.app = app;
//     }
//
//     startRemoveBlock(blockRemovingSpeed: number): void {
//       this.intervalDescriptor = setInterval(() => {
//         intervalsLeft -= 1;
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
import type { MaterialFactory } from '../engine/Material';
import BlockRemover from '../components/BlockRemover';
import GlObject from '../engine/glObject';
import { World } from '../ecs';
import { Transform, Visual, Raytracer } from '../components';
import { createCube } from '../engine/Model';

const blockRemoverProvider = (
  ecs: World,
  BlockRemoverMaterial: MaterialFactory,
) => (id: Entity): Entity => {
  const model = createCube(1.001);
  const material = BlockRemoverMaterial();
  const object = new GlObject({ model, material });
  return ecs.createEntity(
    id,
    new Transform(0, 64, 0),
    new Visual(object),
    new Raytracer(),
    new BlockRemover(),
  );
};

export default blockRemoverProvider;
