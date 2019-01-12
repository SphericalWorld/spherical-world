// @flow strict
import React from 'react';
import type { Rareness } from '../../../../../../common/Inventory/Inventory';
import TooltipText from '../../Elements/TooltipText';
import {
  gridArea,
  common,
  uncommon,
  rare,
} from './tooltipName.module.scss';

const colors = [
  common,
  uncommon,
  rare,
];

type Props = {|
  +name: string;
  +rareness: Rareness;
|}

const TooltipName = ({
  name, rareness,
}: Props) => (
  <TooltipText className={`${colors[rareness]} ${gridArea}`}>
    {name}
  </TooltipText>
);

export default TooltipName;
