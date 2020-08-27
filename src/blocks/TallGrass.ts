import type { BlockData } from './Block';
import model from '../models/tallgrass.json';
import Block from './Block';
import ModelComponent from './components/ModelComponent';
import { tallGrass } from '../../common/blocks/blocksInfo';

const TallGrass = (): BlockData =>
  Block(
    tallGrass,
    {
      buffer: {
        top: 1,
        bottom: 1,
        north: 1,
        south: 1,
        west: 1,
        east: 1,
      },
    },
    ModelComponent(model),
  );

export default TallGrass;
