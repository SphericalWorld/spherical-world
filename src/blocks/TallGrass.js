// @flow
import model from '../models/tallgrass.json';
import Block from './Block';
import ModelComponent from './components/ModelComponent';

const TallGrass = () => Block(
  {
    id: 129,
    lightTransparent: true,
    sightTransparent: true,
    needPhysics: false,
    buffer: {
      top: 1,
      bottom: 1,
      north: 1,
      south: 1,
      west: 1,
      east: 1,
    },
    baseRemoveTime: 0.2,
  },
  ModelComponent(model),
);

export default TallGrass;
