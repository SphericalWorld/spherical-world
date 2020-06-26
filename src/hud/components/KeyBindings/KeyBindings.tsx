import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import type { KeyPosition } from './keyBindingsTypes';
import type { EVENT_CATEGORY } from '../../../Input/eventTypes';
import type { State } from '../../../reducers/rootReducer';
import { getEventInfo } from '../../../../common/constants/input/rawEventInfo';
import { KEY_BINDINGS } from './keyBindingsConstants';
import { startEditKey as doStartEditKey } from './keyBindingsActions';
import { setUIState as doSetUIState } from '../../utils/StateRouter';
import Button from '../../uiElements/Button';
import Label from '../../uiElements/Label';
import StatusPanel from './StatusPanel';
import ModalWindowMenu from '../ModalWindowMenu';
import {
  content,
  command,
  header,
  section,
  commandGroup,
  helpLine,
  footerButtons,
  label,
  labelFirst,
  labelCommandGroup,
} from './keyBindings.module.scss';

type ActionMapppingMappedProps = {
  caption: string;
  action: string;
  firstKey: string;
  secondKey: string;
};

type ActionMapppingProps = SpreadTypes<
  ActionMapppingMappedProps, {
    onSetKey: (action: string, key: KeyPosition) => unknown;
  }
>;

type ActionCategoryMappedProps = {
  name: EVENT_CATEGORY,
  items: ReadonlyArray<ActionMapppingMappedProps>,
}

type ActionCategoryProps = SpreadTypes<
  ActionCategoryMappedProps, {
    onSetKey: (action: string, key: KeyPosition) => unknown;
  }
>;

type DispatchProps = {
  setUIState: typeof doSetUIState,
  startEditKey: typeof doStartEditKey,
};

type KeyBindingsOwnProps = {
  keyCategories: ReadonlyArray<ActionCategoryMappedProps>
};

type KeyBindingsProps = SpreadTypes<KeyBindingsOwnProps, DispatchProps>;

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
      />
    ))
    }
  </div>
);

const KeyBindings = ({ keyCategories, setUIState, startEditKey }: KeyBindingsProps) => {
  const close = useCallback(() => setUIState(KEY_BINDINGS, false), [setUIState]);

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
                <ActionCategory onSetKey={startEditKey} key={category.name} {...category} />)
            }
          </section>
        </section>
        <div className={helpLine}>
          <StatusPanel />
        </div>
        <footer className={footerButtons}>
          <Button size="small">reset to default</Button>
          <Label className={label} />
          <Button size="small">unbind key</Button>
          <Button size="small" onClick={close}>OK</Button>
          <Button size="small" onClick={close}>Cancel</Button>
        </footer>
      </div>
    </ModalWindowMenu>
  );
};

const mapState = ({ keyBindings: { keyCategories } }) => ({ keyCategories });

const mapActions = {
  setUIState: doSetUIState,
  startEditKey: doStartEditKey,
};

export default connect<KeyBindingsProps, {}, _, _, State, _>(mapState, mapActions)(KeyBindings);
