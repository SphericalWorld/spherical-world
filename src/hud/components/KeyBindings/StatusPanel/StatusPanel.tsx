import React from 'react';
import { useSelector } from 'react-redux';
import type { State } from '../../../../reducers/rootReducer';
import Label from '../../../uiElements/Label';
import { labelCommandGroup } from './statusPanel.module.scss';

const StatusPanel = (): JSX.Element => {
  const statusText = useSelector<State>((state) => state.keyBindings.status);

  return (
    <Label size="small" className={labelCommandGroup}>
      {statusText}
    </Label>
  );
};

export default StatusPanel;
