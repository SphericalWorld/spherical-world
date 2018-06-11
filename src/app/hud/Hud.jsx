// @flow
import React from 'react';
import { connect } from 'react-redux';
import MainMenu from './components/MainMenu';

type StateProps = {|
  +mainMenuToggled: boolean;
|};

type Props = StateProps;

const mapState = (state) => {
  const mainMenuToggled = state.hudData.states.mainMenuToggled;
  return ({
    mainMenuToggled,
  });
};

const Hud = (props: Props) => (
  <div>
    {props.mainMenuToggled && <MainMenu />}
  </div>
);

export default connect(mapState, null)(Hud);
