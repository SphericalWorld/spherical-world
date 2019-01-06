// @flow strict
import { useState, useEffect } from 'react';
import dragStore from './dragStore';

type Options<Props> = {|
  active: (props: Props) => ?boolean,
  item: (props: Props) => any,
|};

type Result = {|
  +isDragging: boolean;
  +draggable: boolean;
  +onDragStart?: (e: DragEvent) => ?boolean;
  +onDragEnd?: (e: DragEvent) => ?boolean;
|};

export const useDraggable = <Props>(
  options: Options<Props>,
  type: string,
  props: Props,
): Result => {
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = (e: DragEvent) => {
    if (!e.dataTransfer) return false;
    e.dataTransfer.setData('text/plain', '');
    dragStore.type = type;
    dragStore.item = options.item(props);
    setIsDragging(true);
    return false;
  };

  const onDragEnd = () => {
    setIsDragging(false);
    dragStore.item = null;
    dragStore.type = '';
    return false;
  };

  useEffect(
    () => {
      onDragEnd();
    },
    [props],
  );

  if (!options.active(props)) {
    return { isDragging: false, draggable: false };
  }

  return {
    draggable: true, isDragging, onDragStart, onDragEnd,
  };
};

export default useDraggable;
