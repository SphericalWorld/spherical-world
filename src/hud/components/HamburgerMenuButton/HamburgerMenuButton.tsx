import React, { useCallback } from 'react';
import { useToggleUIState } from '../../utils/StateRouter';
import { MAIN_MENU } from '../MainMenu/mainMenuConstants';
import { wrapper, buttonMenu, innerButtonMenu } from './hamburgerMenuButton.module.scss';

const HamburgerMenuButton = (): JSX.Element => {
  const toggleUIState = useToggleUIState();
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

export default HamburgerMenuButton;
