import type { BlockData } from './Block';
import model from '../models/reeds.json';
import Block from './Block';
import ModelComponent from './components/ModelComponent';
import { reeds } from '../../common/blocks/blocksInfo';

const Reeds = (): BlockData => Block(reeds, ModelComponent(model));

export default Reeds;
