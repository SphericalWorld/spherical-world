// @flow
import model from '../../models/deadBush.json';
import ModelComponent from './components/ModelComponent';
import BasePropertiesComponent from './components/BasePropertiesComponent';

const DeadBush = () => Object.assign(
  {},
  BasePropertiesComponent(),
  ModelComponent(model),
  {
    id: 132,
    lightTransparent: true,
    sightTransparent: true,
    selfTransparent: false,
    needPhysics: false,
  },
);

export default DeadBush;
