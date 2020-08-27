import type { BlockData } from './Block';
import model from '../models/flowerYellow.json';
import Block from './Block';
import ModelComponent from './components/ModelComponent';
import { flowerYellow } from '../../common/blocks/blocksInfo';

const FlowerYellow = (): BlockData => Block(flowerYellow, ModelComponent(model));

export default FlowerYellow;
