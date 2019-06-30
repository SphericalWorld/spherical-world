// @flow strict
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { setUIState as doSetUIState } from '../../utils/StateRouter';
import Button from '../../uiElements/Button';
import ModalWindowMenu from '../ModalWindowMenu';
import { KEY_BINDINGS } from '../KeyBindings/keyBindingsConstants';
import { AUDIO } from '../Audio/audioConstants';
import { VIDEO } from '../Video/videoConstants';
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
  }, [setUIState]);

  const openAudio = useCallback(() => {
    setUIState(MAIN_MENU, false);
    setUIState(AUDIO, true);
  }, [setUIState]);

  const openVideo = useCallback(() => {
    setUIState(MAIN_MENU, false);
    setUIState(VIDEO, true);
  }, [setUIState]);

  const close = useCallback(() => setUIState(MAIN_MENU, false), [setUIState]);

  return (
    <ModalWindowMenu caption="Main Menu">
      <div className={content}>
        <Button onClick={close}>return to game</Button>
        <Button onClick={openVideo}>video</Button>
        <Button onClick={openAudio}>audio</Button>
        <Button onClick={openKeyBindings}>key bindings</Button>
        <Button onClick={close}>exit</Button>
      </div>
    </ModalWindowMenu>
  );
};

const mapActions = {
  setUIState: doSetUIState,
};

export default connect<Props, {||}, _, _, _, _>(null, mapActions)(MainMenu);
