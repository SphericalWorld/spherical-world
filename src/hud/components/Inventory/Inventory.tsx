import { useCallback } from 'react';
import { createSelector } from 'reselect';
import type { State } from '../../../reducers/rootReducer';
import Label from '../../uiElements/Label';
import ModalWindow from '../../uiElements/ModalWindow';
import { INVENTORY } from './inventoryConstants';
import { useSetUIState } from '../../utils/StateRouter';
import { useSwapSlots } from './inventoryActions';
import {
  inventory,
  inventorySlots,
  coins,
  coin,
  empty,
  gold,
  silver,
  bronze,
  icon,
} from './inventory.module.css';
import InventorySlot from '../../uiElements/InventorySlot';
import { useMemoizedSelector } from '../../../util/reducerUtils';
import { blocksInfo } from '../../../blocks/blocksInfo';

const Coin = ({ caption, className }: { caption: string; className: string }) => (
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

const slotsSelector = createSelector(
  (state: State) => state.hudData.player.inventory.slots,
  (state: State) => state.hudData.player.inventory.items,
  (slots, items) => slots.map((el) => items[el || ''] || null),
);

const Inventory = (): JSX.Element => {
  const swapSlots = useSwapSlots();
  const setUIState = useSetUIState();
  const slots = useMemoizedSelector(slotsSelector);
  const close = useCallback(() => setUIState(INVENTORY, false), [setUIState]);
  const swap = useCallback((e) => swapSlots(e.from, e.draggableMeta.source, e.to, 'inventory'), [
    swapSlots,
  ]);
  return (
    <ModalWindow caption="author's inventory" onClose={close}>
      <div>
        <div className={inventory}>
          <ul className={inventorySlots}>
            {slots.map((slot, index) => (
              <InventorySlot
                position={index}
                slot={slot || undefined}
                draggable
                draggableMeta={{ source: 'inventory' }}
                onDrop={swap}
                iconImgSrc={blocksInfo[slot?.itemTypeId]?.itemImage}
              />
            ))}
            {slots.map(() => (
              <li className={empty} />
            ))}
          </ul>
        </div>
        <Footer />
      </div>
    </ModalWindow>
  );
};

export default Inventory;
