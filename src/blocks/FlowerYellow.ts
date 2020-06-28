import type { BlockData } from './Block';
import model from '../models/flowerYellow.json';
import Block from './Block';
import Flower from './Flower';
import ModelComponent from './components/ModelComponent';

const FlowerYellow = (): BlockData =>
  Block(
    {
      id: 130,
    },
    ModelComponent(model),
    Flower(),
  );

export default FlowerYellow;
