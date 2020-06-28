import type { BlockData } from './Block';
import model from '../models/reeds.json';
import Block from './Block';
import ModelComponent from './components/ModelComponent';

const Reeds = (): BlockData =>
  Block(
    {
      id: 133,
      lightTransparent: true,
      sightTransparent: true,
      needPhysics: false,
    },
    ModelComponent(model),
  );

export default Reeds;
