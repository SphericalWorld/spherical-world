import { billboard } from './Billboard';
import Chunk from './Chunk';
import Diffuse from './Diffuse';
import DiffuseAnimated from './DiffuseAnimated';
import Skybox from './Skybox';

const shadersProvider = () => [
  billboard,
  new Chunk(),
  new Diffuse(),
  new DiffuseAnimated(),
  new Skybox(),
];

export default shadersProvider;
