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
          <Button onClick={this.close}>return to game</Button>
          <Button>video</Button>
          <Button>audio</Button>
          <Button onClick={this.openKeyBindings}>key bindings</Button>
          <Button onClick={this.close}>exit</Button>
        </div>
      </ModalWindowMenu>
    );
  }
}

const mapActions = {
  setUIState,
};

export default connect(null, mapActions)(MainMenu);
