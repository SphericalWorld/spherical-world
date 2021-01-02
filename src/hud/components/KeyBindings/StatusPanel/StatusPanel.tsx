import Label from '../../../uiElements/Label';
import { labelCommandGroup } from './statusPanel.module.css';

const StatusPanel = ({ statusText }: { statusText: string }): JSX.Element => {
  return (
    <Label size="small" className={labelCommandGroup}>
      {statusText}
    </Label>
  );
};

export default StatusPanel;
