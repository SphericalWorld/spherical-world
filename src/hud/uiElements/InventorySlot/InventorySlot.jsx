// @flow strict
import React, { memo } from 'react';
import classnames from 'classnames';
import {
  selectedSlot,
  slotInner,
  slotItem,
  slot as slotStyle,
  slotItemCount,
  imageDiamond,
  imageIronIngot,
  dragging,
  dragOver,
} from './inventorySlot.module.scss';
import { useDraggable, useDroppable } from '../../utils/DragAndDrop';

export type InventorySlotDetails = {
  +count: number;
  +icon?: string;
  +id: string;
};

type Props = {|
  +slot?: InventorySlotDetails;
  +selected?: boolean,
  +draggable?: boolean,
  +onDrop?: any => mixed,
  +draggableMeta?: mixed,
  +position?: number,
|};

const images = {
  diamond: imageDiamond,
  ironIngot: imageIronIngot,
};

const SLOT: 'INVENTORY_SLOT' = 'INVENTORY_SLOT';

const dragOptions = {
  active: ({ draggable, slot }) => slot && draggable,
  item: ({
    slot,
    draggableMeta,
    position,
  }) => ({
    id: slot && slot.id,
    from: position,
    draggableMeta,
  }),
};

const dropOptions = {
  active: ({ draggable, isDragging }) => draggable && !isDragging,
  onDrop: ({ onDrop, position }) => (data) => onDrop && onDrop({ ...data, to: position }),
};

const InventorySlot = (props: Props) => {
  const { slot = {}, selected = false } = props;
  const { isDragging, ...draggableProps } = useDraggable(dragOptions, SLOT, props);
  const { canDrop, ...droppableProps } = useDroppable(dropOptions, SLOT, { ...props, isDragging });

  return (
    <li
      {...droppableProps}
      className={classnames(
        slotStyle,
        selected && selectedSlot,
      )}
    >
      <div className={slotInner}>
        <div
          {...draggableProps}
          className={classnames(
            slotItem,
            isDragging && dragging,
            slot.icon && images[slot.icon],
            canDrop && dragOver,
          )}
          sw-item-tooltip="slot"
        >
          <span className={slotItemCount}>
            {slot.count}
          </span>
        </div>
      </div>
    </li>
  );
};

export default memo<Props>(InventorySlot);
