// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { EVENT_CATEGORY } from '../../../Input/eventTypes';
import type { State } from '../../../reducers/rootReducer';
import { KEY_BINDINGS } from './keyBindingsConstants';
import { setUIState } from '../../utils/StateRouter';
import Button from '../../uiElements/Button';
import Label from '../../uiElements/Label';
import ModalWindowMenu from '../ModalWindowMenu';
import {
  content,
  command,
  header,
  footer,
  section,
  commandGroup,
  helpLine,
  footerButtons,
  label,
  labelFirst,
  labelCommandGroup,
} from './keyBindings.scss';

type ActionMapppingProps = {|
  +caption: string;
  +gameEvent: string;
  +firstKey: string;
  +secondKey: string;
|};

type ActionCategoryProps = {|
  +name: EVENT_CATEGORY,
  +items: $ReadOnlyArray<ActionMapppingProps>,
|}

type DispatchProps = {|
  setUIState: typeof setUIState,
|};

type KeyBindingsOwnProps = {|
  +keyCategories: $ReadOnlyArray<ActionCategoryProps>
|};

type KeyBindingsProps = KeyBindingsOwnProps & DispatchProps;

const ActionMappping = ({ caption, firstKey, secondKey }: ActionMapppingProps) => (
  <div className={command}>
    <Label text={caption} className={labelFirst} />
    <Button text={firstKey} size="small" />
    <Button text={secondKey} size="small" />
  </div>
);

const ActionCategory = ({ name, items }: ActionCategoryProps) => (
  <div>
    <article className={commandGroup}>
      <Label text={name} size="big" className={labelCommandGroup} />
    </article>
    { items.map(mapping => <ActionMappping key={mapping.gameEvent} {...mapping} />) }
  </div>
);

class KeyBindings extends PureComponent<KeyBindingsProps> {
  close = () => this.props.setUIState(KEY_BINDINGS, false);

  render() {
    const { keyCategories } = this.props;
    return (
      <ModalWindowMenu caption="Key Bindings">
        <div className={content}>
          <header className={`${command} ${header}`}>
            <Label text="command" className={labelFirst} />
            <Label text="key 1" className={label} />
            <Label text="key 2" className={label} />
          </header>
          <section className={section}>
            <section>
              {
                keyCategories.map(category => <ActionCategory key={category.name} {...category} />)
              }
            </section>
          </section>
          <footer className={footer}>
            <div className={helpLine}>
              <Label text="press key to bind to command" size="small" className={labelCommandGroup} />
            </div>
            <div className={footerButtons}>
              <Button text="reset to default" size="small" />
              <Label text=" " className={label} />
              <Button text="unbind key" size="small" />
              <Button text="OK" size="small" onClick={this.close} />
              <Button text="Cancel" size="small" onClick={this.close} />
            </div>
          </footer>
        </div>
      </ModalWindowMenu>
    );
  }
}

const mapState = ({ keyBindings: { keyCategories } }: State) => ({ keyCategories });

const mapActions = {
  setUIState,
};

export default connect(mapState, mapActions)(KeyBindings);
