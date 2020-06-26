import React from 'react';
import type { Rareness } from '../../../../../../common/Inventory/Inventory';
import TooltipText from '../../Elements/TooltipText';
import { getRarenessColor } from '../../../../utils/CSSHelpers';
import { gridArea } from './tooltipName.module.scss';

type Props = Readonly<{
  name: string;
  rareness: Rareness;
}>;

const TooltipName = ({ name, rareness }: Props) => (
  <TooltipText className={`${getRarenessColor(rareness)} ${gridArea}`}>
    {name}
  </TooltipText>
);

export default TooltipName;
