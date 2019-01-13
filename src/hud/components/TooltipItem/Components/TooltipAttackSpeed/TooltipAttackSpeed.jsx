// @flow strict
import React from 'react';
import TooltipTemplate from '../../Elements/TooltipTemplate';
import {
  gridArea,
} from './tooltipAttackSpeed.module.scss';


type Props = {
  +attackSpeed: number;
}

const TooltipAttackSpeed = ({
  attackSpeed,
}: Props) => (
  <TooltipTemplate name="Attack Speed" value={attackSpeed} className={gridArea} />
);

export default TooltipAttackSpeed;
