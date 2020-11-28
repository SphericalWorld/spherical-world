import TooltipText from '../TooltipText';
import { templateTooltip, labelTooltip, valueTooltip } from './tooltipTemplate.module.css';

type Props = Readonly<{
  value: number;
  name: string;
  className?: string;
}>;

const TooltipTemplate = ({ value, name, className = '' }: Props): JSX.Element | null =>
  typeof value !== 'undefined' ? (
    <TooltipText className={`${templateTooltip} ${className}`}>
      <div>
        <span className={labelTooltip}>{name}:</span>
        <span className={valueTooltip}>{value}</span>
      </div>
    </TooltipText>
  ) : null;

export default TooltipTemplate;
