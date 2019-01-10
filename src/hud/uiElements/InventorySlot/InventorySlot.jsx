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
  animateIncrease,
  animateDecrease,
} from './inventorySlot.module.scss';
import { useDraggable, useDroppable } from '../../utils/DragAndDrop';
import useCSSTransition from '../../utils/CSSTransition';

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

const transitionOptions = {
  duration: 200,
  onChange: (oldVal, newVal) => (oldVal < newVal ? animateIncrease : animateDecrease),
};

const InventorySlot = (props: Props) => {
  const { slot = {}, selected = false } = props;
  const { isDragging, ...draggableProps } = useDraggable(dragOptions, SLOT, props);
  const { canDrop, ...droppableProps } = useDroppable(dropOptions, SLOT, { ...props, isDragging });
  const { className } = useCSSTransition(slot.count, transitionOptions);

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
          <span className={classnames(slotItemCount, className)}>
            {slot.count}
          </span>
        </div>
      </div>
    </li>
  );
};

export default memo<Props>(InventorySlot);
