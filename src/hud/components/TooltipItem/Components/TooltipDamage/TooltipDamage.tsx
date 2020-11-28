import TooltipTemplate from '../../Elements/TooltipTemplate';
import { gridArea } from './tooltipDamage.module.css';

type Props = Readonly<{
  damage: number;
}>;

const TooltipDamage = ({ damage }: Props): JSX.Element => (
  <TooltipTemplate name="damage" value={damage} className={gridArea} />
);

export default TooltipDamage;
