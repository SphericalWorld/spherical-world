// @flow strict
import React from 'react';
import TooltipTemplate from '../../Elements/TooltipTemplate';
import {
  gridArea,
} from './tooltipDamage.module.scss';


type Props = {
  +damage: number;
}

const TooltipDamage = ({
  damage,
}: Props) => (
  <TooltipTemplate name="damage" value={damage} className={gridArea} />
);

export default TooltipDamage;
