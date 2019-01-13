// @flow strict
import React, { memo } from 'react';
import classnames from 'classnames';
import { type Slot } from '../../../../common/Inventory';
import {
  selectedSlot,
  slotInner,
  slotItem,
  slot as slotStyle,
  slotItemCount,
  dragging,
  dragOver,
  animateIncrease,
  animateDecrease,
} from './inventorySlot.module.scss';
import { useDraggable, useDroppable } from '../../utils/DragAndDrop';
import useCSSTransition from '../../utils/CSSTransition';
import TooltipTrigger from '../../components/Tooltip';
import TooltipItem from '../../components/TooltipItem';
import { getIcon } from '../../utils/CSSHelpers';

type Props = {|
  +slot?: Slot;
  +selected?: boolean,
  +draggable?: boolean,
  +onDrop?: any => mixed,
  +draggableMeta?: mixed,
  +position?: number,
|};

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

const Tooltip = (item) => (
  <TooltipItem item={item} />
);

type InventorySlotFilledProps = {|
  +slot: Slot;
  +isDragging: boolean,
  +canDrop: boolean,
  +draggableProps: mixed,
|};

const InventorySlotFilled = (props: InventorySlotFilledProps) => {
  const {
    slot, isDragging, draggableProps, canDrop,
  } = props;
  const { icon = '_no_image_' } = slot;
  const { className } = useCSSTransition(slot.count, transitionOptions);

  return (
    <TooltipTrigger tooltip={Tooltip} tooltipProps={slot}>
      <div className={slotInner}>
        <div
          {...draggableProps}
          className={classnames(
            slotItem,
            isDragging && dragging,
            slot && getIcon(icon),
            canDrop && dragOver,
          )}
        >
          <span className={classnames(slotItemCount, className)}>
            {slot.count}
          </span>
        </div>
      </div>
    </TooltipTrigger>
  );
};

const InventorySlotEmpty = ({ canDrop }: {| canDrop: boolean |}) => (
  <div className={slotInner}>
    <div
      className={classnames(
        slotItem,
        canDrop && dragOver,
      )}
    />
  </div>
);

const InventorySlot = (props: Props) => {
  const { slot, selected = false } = props;
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
      {slot ? (
        <InventorySlotFilled
          slot={slot}
          draggableProps={draggableProps}
          isDragging={isDragging}
          canDrop={canDrop}
        />
      ) : (
        <InventorySlotEmpty canDrop={canDrop} />
      )}
    </li>
  );
};

export default memo<Props>(InventorySlot);
