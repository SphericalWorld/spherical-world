import Billboard from './Billboard';
import Chunk from './Chunk';
import Diffuse from './Diffuse';
import DiffuseAnimated from './DiffuseAnimated';
import Skybox from './Skybox';
import OcclusionCulling from './OcclusionCulling';
import DiffuseInventory from './DiffuseInventory';

const shadersProvider = () => [
  new Billboard(),
  new Chunk(),
  new Diffuse(),
  new DiffuseAnimated(),
  new Skybox(),
  new OcclusionCulling(),
  new DiffuseInventory(),
];

export default shadersProvider;
