import type { KeyPosition } from './keyBindingsTypes';
import type { EventTypes } from '../../../../common/constants/input/eventTypes';
import { createReducer, reduceReducers } from '../../../util/reducerUtils';
import * as events from '../../../Input/events';
import { EVENT_CATEGORIES } from '../../../Input/eventTypes';
import { SET_KEY, KEY_EDITING_STARTED } from './keyBindingsConstants';
import { KEY_SELECT_BUTTON } from '../../hudConstants';

const getKeyCategories = () =>
  Object.values(events)
    .filter((event) => 'caption' in event)
    .reduce(
      (categories, event) => {
        if (!event.category) {
          return categories;
        }
        const eventCategory = event.category;
        const category = categories.find((el) => el.name === eventCategory);
        if (!category) return categories;
        category.items.push({
          caption: event.caption,
          firstKey: 'A',
          secondKey: 'B',
          action: event.action,
        });
        return categories;
      },
      EVENT_CATEGORIES.map((category) => ({ name: category, items: [] })),
    );

export type KeyBindingsState = Readonly<{
  keyCategories: $Call<typeof getKeyCategories>;
  status: string;
  editing: boolean;
  keyPosition?: KeyPosition;
  key?: string;
  action?: EventTypes;
}>;

const initialState: KeyBindingsState = {
  keyCategories: getKeyCategories(),
  status: '',
  editing: false,
};

const setKey = (state, payload) => ({
  ...state,
  keyCategories: state.keyCategories.map((category) => ({
    ...category,
    items: category.items.map((item) =>
      item.action === payload.action
        ? {
            ...item,
            ...payload,
          }
        : item,
    ),
  })),
});

const keyEditingStarted = (state, payload) => ({
  ...state,
  status: 'press key to bind to command',
  editing: true,
  action: payload.action,
  keyPosition: payload.keyPosition,
});

const keyEditingStoped = (state, payload) => ({
  ...state,
  status: '',
  editing: false,
  key: payload,
});

const keySelectButton = (state, payload) =>
  setKey(state, {
    action: state.action,
    ...(state.keyPosition === 'first' ? { firstKey: payload } : {}),
    ...(state.keyPosition === 'second' ? { secondKey: payload } : {}),
  });

export default createReducer<KeyBindingsState>(initialState, {
  [SET_KEY]: setKey,
  [KEY_EDITING_STARTED]: keyEditingStarted,
  [KEY_SELECT_BUTTON]: reduceReducers(keySelectButton, keyEditingStoped),
});
