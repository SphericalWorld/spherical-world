// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setUIState } from '../../utils/StateRouter';
import Button from '../../uiElements/Button';
import ModalWindowMenu from '../ModalWindowMenu';
import { KEY_BINDINGS } from '../KeyBindings/keyBindingsConstants';
import { MAIN_MENU } from './mainMenuConstants';

import {
  content,
} from './mainMenu.module.scss';

type DispatchProps = {|
  +setUIState: typeof setUIState,
|};

type Props = DispatchProps;

class MainMenu extends PureComponent<Props> {
  openKeyBindings = () => {
    this.props.setUIState(MAIN_MENU, false);
    this.props.setUIState(KEY_BINDINGS, true);
  }

  close = () => this.props.setUIState(MAIN_MENU, false);

  render() {
    return (
      <ModalWindowMenu caption="Main Menu">
        <div className={content}>
          <Button text="return to game" onClick={this.close} />
          <Button text="video" />
          <Button text="audio" />
          <Button text="key bindings" onClick={this.openKeyBindings} />
          <Button text="exit" onClick={this.close} />
        </div>
      </ModalWindowMenu>
    );
  }
}

const mapActions = {
  setUIState,
};

export default connect(null, mapActions)(MainMenu);
