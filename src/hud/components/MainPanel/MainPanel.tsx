import React, { useCallback, useEffect } from 'react';
import { createSelector } from 'reselect';
import classnames from 'classnames';
import {
  mainPanel,
  itemsContainer,
  pagination,
  paginationUp,
  paginationDown,
  paginationPage,
  paginationControl,
  mainPanelSection,
} from './mainPanel.module.css';
import { fontMain } from '../../styles/fonts.module.css';
import InventorySlot from '../../uiElements/InventorySlot';
import type { State } from '../../../reducers/rootReducer';
import { useSelectInventoryItem, useSwapSlots } from '../Inventory/inventoryActions';
import { useMemoizedSelector } from '../../../util/reducerUtils';
import { useHudApi } from '../../HudApi';
import { GameEvent } from '../../../Events';

const slotsSelector = createSelector(
  (state: State) => state.mainPanel.slots,
  (state: State) => state.hudData.player.inventory.items,
  (slots, items) => slots.map((el) => items[el || ''] || null),
);

const MainPanel = (): JSX.Element => {
  const selectedItemIndex = useMemoizedSelector(
    (state: State) => state.mainPanel.selectedItemIndex,
  );
  const slots = useMemoizedSelector((state: State) => slotsSelector(state));
  const selectInventoryItem = useSelectInventoryItem();
  const swapSlots = useSwapSlots();
  const hudApi = useHudApi();

  const swap = useCallback(
    (e) => swapSlots(e.from, e.draggableMeta.source, e.to, 'mainPanel', e.id),
    [swapSlots],
  );
  useEffect(() => {
    if (slots[selectedItemIndex]) {
      selectInventoryItem(slots[selectedItemIndex].id);
    }
    hudApi.dispatchGameEvent({ type: GameEvent.itemSelected, payload: slots[selectedItemIndex] });
  }, [selectInventoryItem, selectedItemIndex, slots, hudApi]);

  return (
    <section className={mainPanelSection}>
      <div className={mainPanel}>
        <ul className={itemsContainer}>
          {slots.map((slot, index) => (
            <InventorySlot
              position={index}
              key={slot?.id}
              slot={slot || undefined}
              selected={index === selectedItemIndex}
              draggableMeta={{ source: 'mainPanel' }}
              draggable
              onDrop={swap}
            />
          ))}
        </ul>
        <div className={pagination}>
          <div className={paginationControl}>
            <div className={paginationUp} />
            <div className={paginationDown} />
          </div>
          <div className={classnames(paginationPage, fontMain)}>10</div>
        </div>
      </div>
    </section>
  );
};

export default MainPanel;
