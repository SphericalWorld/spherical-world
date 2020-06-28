import type { BlockData } from './Block';
import model from '../models/flowerRed.json';
import Block from './Block';
import Flower from './Flower';
import ModelComponent from './components/ModelComponent';

const FlowerRed = (): BlockData =>
  Block(
    {
      id: 131,
      baseRemoveTime: 0.2,
    },
    ModelComponent(model),
    Flower(),
  );

export default FlowerRed;
