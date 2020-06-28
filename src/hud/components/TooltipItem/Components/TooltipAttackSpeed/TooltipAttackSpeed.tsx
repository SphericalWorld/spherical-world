import React from 'react';
import TooltipTemplate from '../../Elements/TooltipTemplate';
import { gridArea } from './tooltipAttackSpeed.module.scss';

type Props = Readonly<{
  attackSpeed: number;
}>;

const TooltipAttackSpeed = ({ attackSpeed }: Props): JSX.Element => (
  <TooltipTemplate name="Attack Speed" value={attackSpeed} className={gridArea} />
);

export default TooltipAttackSpeed;
