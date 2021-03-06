import type { Rareness } from '../../../../common/Inventory/Inventory';
import { common, uncommon, rare } from './rareness.module.css';

const colors = [common, uncommon, rare];

const getRarenessColor = (rareness: Rareness): string => colors[rareness];

export default getRarenessColor;
