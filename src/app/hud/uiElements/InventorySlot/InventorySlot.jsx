// @flow
import React from 'react';
import {
  selectedSlot,
  slotItem,
  slot as slotStyle,
  slotItemCount,
  imageDiamond,
  imageIronIngot,
} from './InventorySlot.scss';

export type InventorySlotDetails = {|
  +count: number;
  +image: string;
|};

type Props = {|
  +slot: InventorySlotDetails;
  +selected: boolean
|};

const InventorySlot = ({ slot, selected }: Props) => (
  <li sw-droppable="true" className={`${slotStyle} ${String(selected && selectedSlot)}`}>
    <div className={`${slotItem} ${slot.image === 'diamond' ? imageDiamond : imageIronIngot}`} sw-droppable="true" sw-draggable="slot" ng-style="{'background-image': 'url({{slot.icon}})'}" sw-item-tooltip="slot">
      <span className={slotItemCount}>
        {slot.count}
      </span>
    </div>
  </li>
);

export default InventorySlot;
