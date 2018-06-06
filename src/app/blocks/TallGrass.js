// @flow
import model from '../../models/tallgrass.json';
import ModelComponent from './components/ModelComponent';
import BasePropertiesComponent from './components/BasePropertiesComponent';

const TallGrass = () => Object.assign(
  {},
  BasePropertiesComponent(),
  ModelComponent(),
  {
    id: 129,
    lightTransparent: true,
    sightTransparent: true,
    selfTransparent: false,
    needPhysics: false,
    buffer: {
      top: 1,
    },
    model,
  },
);

export default TallGrass;
