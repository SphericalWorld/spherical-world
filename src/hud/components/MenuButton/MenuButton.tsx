import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import type { State } from '../../../reducers/rootReducer';
import { toggleUIState as doToggleUIState } from '../../utils/StateRouter';
import { MAIN_MENU } from '../MainMenu/mainMenuConstants';
import {
  wrapper,
  buttonMenu,
  innerButtonMenu,
} from './menuButton.module.scss';

type DispatchProps = {
  toggleUIState: typeof doToggleUIState,
};

type Props = DispatchProps;

const MenuButton = ({ toggleUIState }: Props) => {
  const toggle = useCallback(() => toggleUIState(MAIN_MENU), [toggleUIState]);

  return (
    <div className={wrapper}>
      <button onClick={toggle} type="button" className={buttonMenu}>
        <div className={innerButtonMenu}>
          <span />
          <span />
          <span />
        </div>
      </button>
    </div>
  );
};


const mapActions = {
  toggleUIState: doToggleUIState,
};

export default connect<Props, {}, _, DispatchProps, State, _>(null, mapActions)(MenuButton);
