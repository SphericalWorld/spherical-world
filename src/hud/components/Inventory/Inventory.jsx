// @flow strict
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import type { State } from '../../../reducers/rootReducer';
import Label from '../../uiElements/Label';
import ModalWindow from '../../uiElements/ModalWindow';
import { INVENTORY } from './inventoryConstants';
import { setUIState as doSetUIState } from '../../utils/StateRouter';
import { swapSlots as doSwapSlots } from './inventoryActions';
import {
  inventory,
  inventorySlots,
  slot as slotStyle,
  coins,
  coin,
  empty,
  gold,
  silver,
  bronze,
  icon,
} from './inventory.module.scss';
import InventorySlot from '../../uiElements/InventorySlot';
import type { InventorySlotDetails } from '../../uiElements/InventorySlot/InventorySlot';

type MappedProps = {|
  +slots: $ReadOnlyArray<?InventorySlotDetails>;
|};

type DispatchProps = {|
  +setUIState: typeof doSetUIState,
  +swapSlots: typeof doSwapSlots,
|};

type Props = {| ...MappedProps, ...DispatchProps |};

const Coin = ({ caption, className }: { caption: string, className: string }) => (
  <div className={`${coin} ${className}`}>
    <Label className={icon}>🔘</Label>
    <Label>{caption}</Label>
  </div>
);

const Footer = () => (
  <footer className={coins}>
    <Coin caption="gold" className={gold} />
    <Coin caption="silver" className={silver} />
    <Coin caption="bronze" className={bronze} />
  </footer>
);

const Inventory = ({ setUIState, slots, swapSlots }: Props) => {
  const close = useCallback(() => setUIState(INVENTORY, false));
  const swap = useCallback((e) => swapSlots(e.from, e.draggableMeta.source, e.to, 'inventory'));

  return (
    <ModalWindow caption="author's inventory" onClose={close}>
      <div>
        <div className={inventory}>
          <ul className={inventorySlots}>
            { slots.map((slot, index) => (
              <InventorySlot
                position={index}
                slot={slot || undefined}
                draggable
                draggableMeta={{ source: 'inventory' }}
                onDrop={swap}
              />
            ))}
            { slots.map(() => <li className={`${slotStyle} ${empty}`} />)}
          </ul>
        </div>
        <Footer />
      </div>
    </ModalWindow>
  );
};

const slotsSelector = createSelector(
  state => state.hudData.player.inventory.slots,
  state => state.hudData.player.inventory.items,
  (slots, items) => slots.map(el => items[el || ''] || null),
);

const mapState = state => ({
  slots: slotsSelector(state),
});

const mapActions = {
  setUIState: doSetUIState,
  swapSlots: doSwapSlots,
};

export default connect<Props, {||}, _, _, State, _>(mapState, mapActions)(Inventory);
