// @flow strict
import type { Rareness } from '../../../../common/Inventory/Inventory';
import {
  common,
  uncommon,
  rare,
} from './rareness.module.scss';

const colors = [
  common,
  uncommon,
  rare,
];

const getRarenessColor = (rareness: Rareness) => (
  colors[rareness]
);

export default getRarenessColor;
