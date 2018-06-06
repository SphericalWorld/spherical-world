// @flow
import ModelComponent from './components/ModelComponent';
import BasePropertiesComponent from './components/BasePropertiesComponent';

const Flower = () => Object.assign(
  {},
  BasePropertiesComponent(),
  ModelComponent(),
  {
    lightTransparent: true,
    sightTransparent: true,
    selfTransparent: false,
    needPhysics: false,
  },
);

export default Flower;
