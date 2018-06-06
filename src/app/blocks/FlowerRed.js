// @flow
import Flower from './Flower';
import model from '../../models/flowerRed.json';

const FlowerRed = () => Object.assign(
  {},
  {
    id: 131,
    model,
  },
  Flower(),
);

export default FlowerRed;
