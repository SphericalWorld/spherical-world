import React from 'react';
import type { State } from '../../../../reducers/rootReducer';
import Label from '../../../uiElements/Label';
import { labelCommandGroup } from './statusPanel.module.scss';
import { useMemoizedSelector } from '../../../../util/reducerUtils';

const StatusPanel = (): JSX.Element => {
  const statusText = useMemoizedSelector<State>((state) => state.keyBindings.status);

  return (
    <Label size="small" className={labelCommandGroup}>
      {statusText}
    </Label>
  );
};

export default StatusPanel;
