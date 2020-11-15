import React from 'react';
import type { Slot } from '../../../../common/Inventory/Inventory';
import TooltipName from './Components/TooltipName';
import TooltipDamage from './Components/TooltipDamage';
import TooltipDescription from './Components/TooltipDescription';
import TooltipImage from './Components/TooltipImage';
import TooltipAttackSpeed from './Components/TooltipAttackSpeed';
import { toolTipGrid, common, uncommon, rare } from './tooltip.module.css';

const colors = [common, uncommon, rare];

const TooltipDefinitions = [
  TooltipName,
  TooltipDamage,
  TooltipDescription,
  TooltipImage,
  TooltipAttackSpeed,
];

type Props = Readonly<{
  item: Slot;
  icon: string;
}>;

const Tooltip = ({ item, icon }: Props): JSX.Element => (
  <div className={`${colors[item.rareness]} ${toolTipGrid}`}>
    {TooltipDefinitions.map((Component, index) => (
      <Component key={index} icon={icon} {...item} />
    ))}
  </div>
);

export default Tooltip;
