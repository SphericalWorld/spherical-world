// @flow
import model from '../../models/reeds.json';
import ModelComponent from './components/ModelComponent';
import BasePropertiesComponent from './components/BasePropertiesComponent';

const Reeds = () => Object.assign(
  {},
  BasePropertiesComponent(),
  ModelComponent(),
  {
    id: 133,
    lightTransparent: true,
    sightTransparent: true,
    selfTransparent: false,
    needPhysics: false,
    model,
  },
);

export default Reeds;
