// @flow strict
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import type { State } from '../../../reducers/rootReducer';
import Label from '../../uiElements/Label';
import ModalWindow from '../../uiElements/ModalWindow';
import { INVENTORY } from './inventoryConstants';
import { setUIState as doSetUIState } from '../../utils/StateRouter';
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

const Inventory = ({ setUIState, slots }: Props) => {
  const close = useCallback(() => setUIState(INVENTORY, false));
  return (
    <ModalWindow caption="author's inventory" onClose={close}>
      <div>
        <div className={inventory}>
          <ul className={inventorySlots}>
            { slots.map(slot => (
              <InventorySlot
                slot={slot || undefined}
                draggable
                draggableMeta={{ source: 'inventory' }}
                onDrop={e => console.log(e)}
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

const mapState = ({
  hudData: {
    player: {
      inventory: {
        slots,
        items,
      },
    },
  },
}) => ({
  slots: slots.map(el => items[el || ''] || null),
});

const mapActions = {
  setUIState: doSetUIState,
};

export default connect<Props, {||}, _, _, State, _>(mapState, mapActions)(Inventory);
