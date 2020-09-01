import React from 'react';
import type { Rareness } from '../../../../../../common/Inventory/Inventory';
import TooltipText from '../../Elements/TooltipText';
import { getRarenessColor } from '../../../../utils/CSSHelpers';
import { gridArea } from './tooltipName.module.css';

type Props = Readonly<{
  name: string;
  rareness: Rareness;
}>;

const TooltipName = ({ name, rareness }: Props): JSX.Element => (
  <TooltipText className={`${getRarenessColor(rareness)} ${gridArea}`}>{name}</TooltipText>
);

export default TooltipName;
