// @flow
import React from 'react';
import { connect } from 'react-redux';
import MainMenu from './components/MainMenu';
import MainPanel from './components/MainPanel/MainPanel';

type StateProps = {|
  +mainMenuToggled: boolean;
|};

type Props = StateProps;

const mapState = ({
  hudData: { states: { mainMenuToggled } },
}) => ({
  mainMenuToggled,
});

const Hud = (props: Props) => (
  <div>
    <MainPanel />
    {props.mainMenuToggled && <MainMenu />}
  </div>
);

export default connect(mapState, null)(Hud);
