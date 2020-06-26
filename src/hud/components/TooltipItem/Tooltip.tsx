import React from 'react';
import type { Rareness } from '../../../../common/Inventory/Inventory';
import TooltipName from './Components/TooltipName';
import TooltipDamage from './Components/TooltipDamage';
import TooltipDescription from './Components/TooltipDescription';
import TooltipImage from './Components/TooltipImage';
import TooltipAttackSpeed from './Components/TooltipAttackSpeed';
import { toolTipGrid, common, uncommon, rare } from './tooltip.module.scss';

const colors = [common, uncommon, rare];

const TooltipDefinitions = [
  TooltipName,
  TooltipDamage,
  TooltipDescription,
  TooltipImage,
  TooltipAttackSpeed,
];

type ItemType = Readonly<{
  name: string;
  rareness: Rareness;
  damage?: number;
  icon?: string;
  description?: string;
  attackSpeed?: number;
}>;

type Props = Readonly<{
  item: ItemType;
}>;

const Tooltip = ({ item }: Props) => (
  <div className={`${colors[item.rareness]} ${toolTipGrid}`}>
    {TooltipDefinitions.map((Component, index) => (
      <Component key={index} {...item} />
    ))}
  </div>
);

export default Tooltip;
