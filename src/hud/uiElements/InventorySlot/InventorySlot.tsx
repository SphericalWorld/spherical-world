import React, { memo } from 'react';
import classnames from 'classnames';
import type { Slot } from '../../../../common/Inventory';
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
  slotStyleClass,
  smallImg,
  mediumImg,
  bigImg,
} from './inventorySlot.module.css';
import { fontMain } from '../../styles/fonts.module.css';
import { useDraggable, useDroppable } from '../../utils/DragAndDrop';
import useCSSTransition from '../../utils/CSSTransition';
import TooltipTrigger from '../../components/Tooltip';
import TooltipItem from '../../components/TooltipItem';
import { getIcon } from '../../utils/CSSHelpers';

type Props = Readonly<{
  slot?: Slot;
  selected?: boolean;
  draggable?: boolean;
  onDrop?: (any) => unknown;
  draggableMeta?: unknown;
  position?: number;
  iconImgSrc?: string;
}>;

const SLOT: 'INVENTORY_SLOT' = 'INVENTORY_SLOT';

const dragOptions = {
  active: ({ draggable, slot }) => slot && draggable,
  item: ({ slot, draggableMeta, position }) => ({
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
  onChange: (oldVal: number, newVal: number) =>
    oldVal < newVal ? animateIncrease : animateDecrease,
};

const Tooltip = (item: Slot) => <TooltipItem item={item} />;

type InventorySlotFilledProps = Readonly<{
  slot: Slot;
  isDragging: boolean;
  canDrop: boolean;
  draggableProps?: unknown;
  iconImgSrc?: string;
  size?: 'small' | 'medium' | 'big';
}>;

const sizeCSS = {
  small: smallImg,
  medium: mediumImg,
  big: bigImg,
};

export const InventorySlotFilled = (props: InventorySlotFilledProps) => {
  const { slot, isDragging, draggableProps, canDrop, iconImgSrc, size = 'medium' } = props;
  const { icon = '_no_image_' } = slot;
  const { className } = useCSSTransition(slot.count, transitionOptions);
  // console.log(slot);
  return (
    <TooltipTrigger tooltip={Tooltip} tooltipProps={slot} icon={iconImgSrc}>
      <div className={slotInner}>
        <img
          {...draggableProps}
          className={classnames(
            slotItem,
            isDragging && dragging,
            sizeCSS[size],
            canDrop && dragOver,
          )}
          src={iconImgSrc}
          alt="ItemIcon"
        />
        <span className={classnames(slotItemCount, className)}>{slot.count}</span>
      </div>
    </TooltipTrigger>
  );
};

const InventorySlotEmpty = ({ canDrop }: { canDrop: boolean }) => (
  <div className={slotInner}>
    <div className={classnames(slotItem, canDrop && dragOver)} />
  </div>
);

const InventorySlot = (props: Props) => {
  const { slot, iconImgSrc, selected = false } = props;
  const { isDragging, ...draggableProps } = useDraggable(dragOptions, SLOT, props);
  const { canDrop, ...droppableProps } = useDroppable(dropOptions, SLOT, {
    ...props,
    isDragging,
  });

  return (
    <li
      {...droppableProps}
      className={classnames(slotStyle, fontMain, slotStyleClass, selected && selectedSlot)}
    >
      {slot ? (
        <InventorySlotFilled
          slot={slot}
          draggableProps={draggableProps}
          isDragging={isDragging}
          canDrop={canDrop}
          iconImgSrc={iconImgSrc}
        />
      ) : (
        <InventorySlotEmpty canDrop={canDrop} />
      )}
    </li>
  );
};

export default memo<Props>(InventorySlot);
