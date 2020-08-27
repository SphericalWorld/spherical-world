import type { BlockData } from './Block';
import Block from './Block';
import { air } from '../../common/blocks/blocksInfo';

const Air = (): BlockData => Block(air);

export default Air;
