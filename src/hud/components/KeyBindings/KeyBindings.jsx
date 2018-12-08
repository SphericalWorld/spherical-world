// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { KeyPosition } from './keyBindingsTypes';
import type { EVENT_CATEGORY } from '../../../Input/eventTypes';
import type { State } from '../../../reducers/rootReducer';
import { getEventInfo } from '../../../../common/constants/input/rawEventInfo';
import { KEY_BINDINGS } from './keyBindingsConstants';
import { startEditKey } from './keyBindingsActions';
import { setUIState } from '../../utils/StateRouter';
import Button from '../../uiElements/Button';
import Label from '../../uiElements/Label';
import StatusPanel from './StatusPanel';
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
} from './keyBindings.module.scss';

type ActionMapppingProps = {|
  +caption: string;
  +action: string;
  +firstKey: string;
  +secondKey: string;
  +onSetKey: (action: string, key: KeyPosition) => mixed;
|};

type ActionCategoryProps = {|
  +name: EVENT_CATEGORY,
  +items: $ReadOnlyArray<ActionMapppingProps>,
  +onSetKey: (action: string, key: KeyPosition) => mixed;
|}

type DispatchProps = {|
  +setUIState: typeof setUIState,
  +startEditKey: typeof startEditKey,
|};

type KeyBindingsOwnProps = {|
  +keyCategories: $ReadOnlyArray<ActionCategoryProps>
|};

type KeyBindingsProps = { ...KeyBindingsOwnProps, ...DispatchProps };

const ActionMappping = ({
  caption, firstKey, secondKey, action, onSetKey,
}: ActionMapppingProps) => (
  <div className={command}>
    <Label className={labelFirst}>{caption}</Label>
    <Button onClick={() => onSetKey(action, 'first')} size="small">{getEventInfo(firstKey).caption}</Button>
    <Button onClick={() => onSetKey(action, 'second')} size="small">{getEventInfo(secondKey).caption}</Button>
  </div>
);

const ActionCategory = ({ name, items, onSetKey }: ActionCategoryProps) => (
  <div>
    <article className={commandGroup}>
      <Label size="big" className={labelCommandGroup}>{name}</Label>
    </article>
    {items.map(mapping => (
      <ActionMappping
        key={mapping.action}
        onSetKey={onSetKey}
        {...mapping}
      />))
    }
  </div>
);

class KeyBindings extends PureComponent<KeyBindingsProps> {
  close = () => this.props.setUIState(KEY_BINDINGS, false);
  startEditKey = (action: string, key: KeyPosition) => this.props.startEditKey(action, key);

  render() {
    const { keyCategories } = this.props;
    return (
      <ModalWindowMenu caption="Key Bindings">
        <div className={content}>
          <header className={`${command} ${header}`}>
            <Label className={labelFirst}>command</Label>
            <Label className={label}>key 1</Label>
            <Label className={label}>key 2</Label>
          </header>
          <section className={section}>
            <section>
              {
                keyCategories.map(category =>
                  <ActionCategory onSetKey={this.startEditKey} key={category.name} {...category} />)
              }
            </section>
          </section>
          <footer className={footer}>
            <div className={helpLine}>
              <StatusPanel />
            </div>
            <div className={footerButtons}>
              <Button size="small">reset to default</Button>
              <Label className={label} />
              <Button size="small">unbind key</Button>
              <Button size="small" onClick={this.close}>OK</Button>
              <Button size="small" onClick={this.close}>Cancel</Button>
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
  startEditKey,
};

export default connect(mapState, mapActions)(KeyBindings);
