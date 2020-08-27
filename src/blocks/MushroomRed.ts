import type { BlockData } from './Block';
import model from '../models/mushroomRed.json';
import Block from './Block';
import ModelComponent from './components/ModelComponent';
import { mushroomRed } from '../../common/blocks/blocksInfo';

const MushroomRed = (): BlockData => Block(mushroomRed, ModelComponent(model));

export default MushroomRed;
