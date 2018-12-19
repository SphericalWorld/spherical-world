// @flow strict
import { createReducer } from '../../../util/reducerUtils';
import * as events from '../../../Input/events';
import { EVENT_CATEGORIES } from '../../../Input/eventTypes';
import { SET_KEY, KEY_EDITING_STARTED } from './keyBindingsConstants';
// $FlowFixMe
const getKeyCategories = () => (Object.values(events): $ReadOnlyArray<$Values<typeof events>>)
  .filter(event => 'caption' in event)
  .reduce((categories, event) => {
    if (!event.category) {
      return categories;
    }
    const eventCategory = event.category;
    const category = categories.find(el => el.name === eventCategory);
    if (!category) return categories;
    category.items.push({
      caption: event.caption,
      category: event.category,
      firstKey: 'A',
      secondKey: 'B',
      action: event.action,
    });
    return categories;
  },
  EVENT_CATEGORIES.map(category => ({ name: category, items: [] })));

const initialState = {
  keyCategories: getKeyCategories(),
  status: '',
};

export default createReducer<typeof initialState>(initialState, {
  [SET_KEY]: (state, payload) => ({
    ...state,
    keyCategories: state.keyCategories.map(category => ({
      ...category,
      items: category.items.map(item => (item.action === payload.action ? {
        ...item,
        ...payload,
      } : item)),
    })),
  }),
  [KEY_EDITING_STARTED]: (state, payload) => ({
    ...state,
    status: 'press key to bind to command',
  }),
});
