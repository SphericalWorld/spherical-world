import type { BlockData } from './Block';
import model from '../models/flowerRed.json';
import Block from './Block';
import ModelComponent from './components/ModelComponent';
import { flowerRed } from '../../common/blocks/blocksInfo';

const FlowerRed = (): BlockData => Block(flowerRed, ModelComponent(model));

export default FlowerRed;
