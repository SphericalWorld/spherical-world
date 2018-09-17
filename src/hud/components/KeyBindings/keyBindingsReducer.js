// @flow
import { createReducer } from '../../../util/reducerUtils';
import * as events from '../../../Input/events';
import { EVENT_CATEGORIES } from '../../../Input/eventTypes';

// $FlowFixMe
const keyCategories = (Object.values(events): $ReadOnlyArray<$Values<typeof events>>)
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
    });
    return categories;
  },
  EVENT_CATEGORIES.map(category => ({ name: category, items: [] })));

const initialState = {
  keyCategories,
};

export default createReducer(initialState, {});
