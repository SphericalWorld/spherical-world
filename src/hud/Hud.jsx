// @flow
import React from 'react';
import { connect } from 'react-redux';
import MainMenu from './components/MainMenu';
import MainPanel from './components/MainPanel/MainPanel';
import KeyBindings from './components/KeyBindings/KeyBindings';

type StateProps = {|
  +mainMenuToggled: boolean;
|};

type Props = StateProps;

const mapState = ({
  hudData: { states: { mainMenuToggled } },
}) => ({
  mainMenuToggled,
});

const Hud = ({ mainMenuToggled }: Props) => (
  <div>
    <MainPanel />
    {mainMenuToggled && <KeyBindings />}
  </div>
);

export default connect(mapState, null)(Hud);
