import type { BlockData } from './Block';
import model from '../models/mushroomBrown.json';
import Block from './Block';
import Mushroom from './Mushroom';
import ModelComponent from './components/ModelComponent';
import { MUSHROOM_BROWN } from '../../common/blocks';

const MushroomBrown = (): BlockData =>
  Block(
    {
      id: MUSHROOM_BROWN,
      baseRemoveTime: 0.2,
    },
    ModelComponent(model),
    Mushroom(),
  );

export default MushroomBrown;
