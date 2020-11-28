import TooltipText from '../../Elements/TooltipText';
import { descriptionTooltip, gridArea } from './tooltipDescription.module.css';

type Props = Readonly<{
  description: string;
}>;

const TooltipDescription = ({ description }: Props): JSX.Element | null =>
  typeof description !== 'undefined' ? (
    <TooltipText className={`${descriptionTooltip} ${gridArea}`}>
      <span>{description}</span>
    </TooltipText>
  ) : null;

export default TooltipDescription;
