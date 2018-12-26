// @flow strict
import React from 'react';
import { connect } from 'react-redux';
import type { State } from '../../../reducers/rootReducer';

type OwnProps = {|
  on: string,
  component: React$ComponentType<*>,
|};

type MappedProps = {|
  +uiStates: $PropertyType<State, 'uiStates'>
|};

type Props = {| ...OwnProps, ...MappedProps |};

const mapState = ({
  uiStates,
}: State) => ({
  uiStates,
});

const Route = ({ on, uiStates, component: Component }: Props) => (
  uiStates[on] ? <Component /> : null
);

export default connect<Props, OwnProps, _, _, _, _>(mapState, null)(Route);
