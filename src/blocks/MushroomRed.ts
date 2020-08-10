import type { BlockData } from './Block';
import model from '../models/mushroomRed.json';
import Block from './Block';
import Mushroom from './Mushroom';
import ModelComponent from './components/ModelComponent';
import { MUSHROOM_RED } from '../../common/blocks';

const MushroomRed = (): BlockData =>
  Block(
    {
      id: MUSHROOM_RED,
      baseRemoveTime: 0.2,
    },
    ModelComponent(model),
    Mushroom(),
  );

export default MushroomRed;
