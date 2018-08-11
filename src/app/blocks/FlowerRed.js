// @flow
import model from '../../models/flowerRed.json';
import Flower from './Flower';
import ModelComponent from './components/ModelComponent';
import BasePropertiesComponent from './components/BasePropertiesComponent';

const FlowerRed = () => Object.assign(
  {},
  {
    id: 131,
  },
  BasePropertiesComponent(),
  ModelComponent(model),
  Flower(),
);

export default FlowerRed;
