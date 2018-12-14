// @flow
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { setUIState as doSetUIState } from '../../utils/StateRouter';
import Button from '../../uiElements/Button';
import ModalWindowMenu from '../ModalWindowMenu';
import { KEY_BINDINGS } from '../KeyBindings/keyBindingsConstants';
import { MAIN_MENU } from './mainMenuConstants';

import {
  content,
} from './mainMenu.module.scss';

type DispatchProps = {|
  +setUIState: typeof doSetUIState,
|};

type Props = DispatchProps;

const MainMenu = ({ setUIState }: Props) => {
  const openKeyBindings = useCallback(() => {
    setUIState(MAIN_MENU, false);
    setUIState(KEY_BINDINGS, true);
  });

  const close = useCallback(() => setUIState(MAIN_MENU, false));

  return (
    <ModalWindowMenu caption="Main Menu">
      <div className={content}>
        <Button onClick={close}>return to game</Button>
        <Button>video</Button>
        <Button>audio</Button>
        <Button onClick={openKeyBindings}>key bindings</Button>
        <Button onClick={close}>exit</Button>
      </div>
    </ModalWindowMenu>
  );
};

const mapActions = {
  setUIState: doSetUIState,
};

export default connect(null, mapActions)(MainMenu);
