import { useCallback, useState } from 'react';
import classnames from 'classnames';
import type { EVENT_CATEGORY } from '../../../Input/eventTypes';
import { getEventInfo } from '../../../../common/constants/input/rawEventInfo';
import { KEY_BINDINGS } from './keyBindingsConstants';
import { useSetUIState } from '../../utils/StateRouter';
import Button from '../../uiElements/Button';
import Label from '../../uiElements/Label';
import StatusPanel from './StatusPanel';
import ModalWindowMenu from '../ModalWindowMenu';

import {
  command,
  header,
  section,
  commandGroup,
  helpLine,
  label,
  labelFirst,
  labelCommandGroup,
} from './keyBindings.module.css';
import { scrollbarBox } from '../../uiElements/Scrollbar/scrollbar.module.css';
import MenuFooterButtons from '../MenuFooterButtons';
import ModalWindowInnerContent from '../ModalWindowInnerContent/ModalWindowInnerContent';
import { Input, KeyPosition } from '../../../Input';
import * as events from '../../../Input/events';
import { EVENT_CATEGORIES } from '../../../Input/eventTypes';
import type { InputEvent } from '../../../../common/constants/input/eventTypes';

type ActionMapppingMappedProps = {
  caption: string;
  action: InputEvent;
  firstKey: string;
  secondKey: string;
};

type ActionMapppingProps = SpreadTypes<
  ActionMapppingMappedProps,
  {
    onSetKey: (action: InputEvent, key: KeyPosition) => unknown;
  }
>;

type ActionCategoryMappedProps = {
  name: EVENT_CATEGORY;
  items: ReadonlyArray<ActionMapppingMappedProps>;
};

type ActionCategoryProps = SpreadTypes<
  ActionCategoryMappedProps,
  {
    onSetKey: (action: InputEvent, key: KeyPosition) => unknown;
  }
>;

const ActionMappping = ({
  caption,
  firstKey,
  secondKey,
  action,
  onSetKey,
}: ActionMapppingProps) => (
  <div className={command}>
    <Label className={labelFirst}>{caption}</Label>
    <Button onClick={() => onSetKey(action, 'first')} size="small">
      {getEventInfo(firstKey).caption}
    </Button>
    <Button onClick={() => onSetKey(action, 'second')} size="small">
      {getEventInfo(secondKey).caption}
    </Button>
  </div>
);

const ActionCategory = ({ name, items, onSetKey }: ActionCategoryProps) => (
  <div>
    <article className={commandGroup}>
      <Label size="big" className={labelCommandGroup}>
        {name}
      </Label>
    </article>
    {items.map((mapping) => (
      <ActionMappping
        key={mapping.action}
        onSetKey={onSetKey}
        caption={mapping.caption}
        firstKey={mapping.firstKey}
        secondKey={mapping.secondKey}
        action={mapping.action}
      />
    ))}
  </div>
);

const getKeyCategories = () =>
  Object.values(events).reduce(
    (categories, event) => {
      if (!('category' in event)) {
        return categories;
      }
      const eventCategory = event.category;
      const category = categories.find((el) => el.name === eventCategory);
      const keyMapping = Input.keyMappings.get(event.action);
      if (!category || !keyMapping) return categories;
      category.items.push({
        caption: event.caption,
        firstKey: keyMapping.first,
        secondKey: keyMapping.second,
        action: event.action,
      });
      return categories;
    },
    EVENT_CATEGORIES.map((category) => ({
      name: category,
      items: [] as Array<ActionMapppingMappedProps>,
    })),
  );

export const useStartEditKey = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [keyCategories, setKeyCategories] = useState(getKeyCategories);
  const startEditKey = useCallback((action: InputEvent, keyPosition: KeyPosition) => {
    setIsEditing(true);
    Input.waitForNewKey(action, keyPosition, (key: string) => {
      setKeyCategories(getKeyCategories());
      setIsEditing(false);
    });
  }, []);
  return { startEditKey, isEditing, keyCategories };
};

const KeyBindings = (): JSX.Element => {
  const setUIState = useSetUIState();
  const { startEditKey, isEditing, keyCategories } = useStartEditKey();
  const close = useCallback(() => setUIState(KEY_BINDINGS, false), [setUIState]);

  return (
    <ModalWindowMenu caption="Key Bindings">
      <ModalWindowInnerContent>
        <header className={`${command} ${header}`}>
          <Label className={labelFirst}>command</Label>
          <Label className={label}>key 1</Label>
          <Label className={label}>key 2</Label>
        </header>
        <section className={classnames(section, scrollbarBox)}>
          <section>
            {keyCategories.map((category) => (
              <ActionCategory
                onSetKey={startEditKey}
                key={category.name}
                name={category.name}
                items={category.items}
              />
            ))}
          </section>
        </section>
        <div className={helpLine}>
          <StatusPanel statusText={isEditing ? 'press key to bind to command' : ''} />
        </div>
        <MenuFooterButtons close={close} />
      </ModalWindowInnerContent>
    </ModalWindowMenu>
  );
};

export default KeyBindings;
