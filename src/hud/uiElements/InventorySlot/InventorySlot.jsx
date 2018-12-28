// @flow strict
import React from 'react';
import {
  selectedSlot,
  slotItem,
  slot as slotStyle,
  slotItemCount,
  imageDiamond,
  imageIronIngot,
} from './inventorySlot.module.scss';

export type InventorySlotDetails = {
  +count: number;
  +icon?: string;
  +id: string;
};

type Props = {|
  +slot?: InventorySlotDetails;
  +selected?: boolean
|};

const images = {
  diamond: imageDiamond,
  ironIngot: imageIronIngot,
};

const InventorySlot = ({ slot = {}, selected }: Props) => (
  <li sw-droppable="true" className={`${slotStyle} ${String(selected && selectedSlot)}`}>
    <div className={`${slotItem} ${slot.icon ? images[slot.icon] : ''}`} sw-droppable="true" sw-draggable="slot" sw-item-tooltip="slot">
      <span className={slotItemCount}>
        {slot.count}
      </span>
    </div>
  </li>
);

export default InventorySlot;
