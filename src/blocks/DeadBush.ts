import type { BlockData } from './Block';
import model from '../models/deadBush.json';
import Block from './Block';
import ModelComponent from './components/ModelComponent';
import { deadBush } from '../../common/blocks/blocksInfo';

const DeadBush = (): BlockData => Block(deadBush, ModelComponent(model));

export default DeadBush;
