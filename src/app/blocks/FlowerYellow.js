// @flow
import model from '../../models/flowerYellow.json';
import Flower from './Flower';
import ModelComponent from './components/ModelComponent';
import BasePropertiesComponent from './components/BasePropertiesComponent';

const FlowerYellow = () => Object.assign(
  {},
  {
    id: 130,
  },
  BasePropertiesComponent(),
  ModelComponent(model),
  Flower(),
);

export default FlowerYellow;
