// @flow
import model from '../../models/reeds.json';
import Block from './Block';
import ModelComponent from './components/ModelComponent';

const Reeds = () => Block(
  {
    id: 133,
    lightTransparent: true,
    sightTransparent: true,
    selfTransparent: false,
    needPhysics: false,
  },
  ModelComponent(model),
);

export default Reeds;
