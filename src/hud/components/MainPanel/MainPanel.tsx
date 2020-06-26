import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import {
  mainPanel,
  itemsContainer,
  pagination,
  paginationUp,
  paginationDown,
  paginationPage,
  paginationControl,
  mainPanelSection,
} from './mainPanel.module.scss';
import InventorySlot from '../../uiElements/InventorySlot';
import type { Slot } from '../../../../common/Inventory';
import type { State } from '../../../reducers/rootReducer';
import {
  swapSlots as doSwapSlots,
  selectInventoryItem as doSelectInventoryItem,
} from '../Inventory/inventoryActions';

type MappedProps = {
  slots: ReadonlyArray<Slot | null>;
  selectedItemIndex: number;
};

type DispatchProps = {
  swapSlots: typeof doSwapSlots,
  selectInventoryItem: typeof doSelectInventoryItem,
};

type Props = SpreadTypes<MappedProps, DispatchProps>;

const MainPanel = ({
  slots, selectedItemIndex, swapSlots, selectInventoryItem,
}: Props) => {
  const swap = useCallback((e) => swapSlots(e.from, e.draggableMeta.source, e.to, 'mainPanel', e.id), [swapSlots]);
  useEffect(
    () => {
      if (slots[selectedItemIndex]) {
        selectInventoryItem(slots[selectedItemIndex].id);
      }
    },
    [selectInventoryItem, selectedItemIndex, slots],
  );

  return (
    <section className={mainPanelSection}>
      <div className={mainPanel}>
        <ul className={itemsContainer}>
          { slots.map((slot, index) => (
            <InventorySlot
              position={index}
              key={index}
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
          <div className={paginationPage}>
            10
          </div>
        </div>
      </div>
    </section>
  );
};

const slotsSelector = createSelector(
  state => state.mainPanel.slots,
  state => state.hudData.player.inventory.items,
  (slots, items) => slots.map(el => items[el || ''] || null),
);

const mapState = state => ({
  selectedItemIndex: state.mainPanel.selectedItemIndex,
  slots: slotsSelector(state),
});

const mapActions = {
  swapSlots: doSwapSlots,
  selectInventoryItem: doSelectInventoryItem,
};

export default connect<Props, {}, _, _, State, _>(mapState, mapActions)(MainPanel);
