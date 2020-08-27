import type { BlockData } from './Block';
import model from '../models/mushroomBrown.json';
import Block from './Block';
import ModelComponent from './components/ModelComponent';
import { mushroomBrown } from '../../common/blocks/blocksInfo';

const MushroomBrown = (): BlockData => Block(mushroomBrown, ModelComponent(model));

export default MushroomBrown;
