import { billboard } from './Billboard';
import Chunk from './Chunk';
import Diffuse from './Diffuse';
import DiffuseAnimated from './DiffuseAnimated';
import Skybox from './Skybox';
import OcclusionCulling from './OcclusionCulling';

const shadersProvider = () => [
  billboard,
  new Chunk(),
  new Diffuse(),
  new DiffuseAnimated(),
  new Skybox(),
  new OcclusionCulling(),
];

export default shadersProvider;
