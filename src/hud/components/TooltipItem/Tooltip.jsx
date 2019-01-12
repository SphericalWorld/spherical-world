// @flow strict
import React from 'react';
import type { Rareness } from '../../../../common/Inventory/Inventory';
import TooltipName from './Components/TooltipName';
import TooltipDamage from './Components/TooltipDamage';
import TooltipDescription from './Components/TooltipDescription';
import TooltipImage from './Components/TooltipImage';
import TooltipAttackSpeed from './Components/TooltipAttackSpeed';
import {
  toolTipGrid,
} from './tooltip.module.scss';

const TooltipDefinitions = [
  TooltipName,
  TooltipDamage,
  TooltipDescription,
  TooltipImage,
  TooltipAttackSpeed,
];

type ItemType = {
  +name: string,
  +rareness: Rareness,
  +damage: number,
  +image: string,
  +description: string,
  +attackSpeed: number,
}

type Props = {|
  +item: ItemType,
|}

const Tooltip = ({
  item,
}: Props) => (
  <div className={toolTipGrid}>
    {
      TooltipDefinitions.map(Component => <Component {...item} />)
    }
  </div>
);

export default Tooltip;
