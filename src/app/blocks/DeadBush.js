// @flow
import model from '../../models/deadBush.json';
import ModelComponent from './components/ModelComponent';
import BasePropertiesComponent from './components/BasePropertiesComponent';

const DeadBush = () => Object.assign(
  {},
  BasePropertiesComponent(),
  ModelComponent(),
  {
    id: 132,
    lightTransparent: true,
    sightTransparent: true,
    selfTransparent: false,
    needPhysics: false,
    model,
  },
);

export default DeadBush;
