import type { BlockData } from './Block';
import model from '../models/deadBush.json';
import Block from './Block';
import ModelComponent from './components/ModelComponent';

const DeadBush = (): BlockData =>
  Block(
    {
      id: 132,
      lightTransparent: true,
      sightTransparent: true,
      needPhysics: false,
    },
    ModelComponent(model),
  );

export default DeadBush;
