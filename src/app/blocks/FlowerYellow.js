// @flow
import Flower from './Flower';
import model from '../../models/flowerYellow.json';

const FlowerYellow = () => Object.assign(
  {},
  {
    id: 130,
    model,
  },
  Flower(),
);

export default FlowerYellow;
