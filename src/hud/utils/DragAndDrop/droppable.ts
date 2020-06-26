import { useState } from 'react';
import dragStore from './dragStore';

type Options<Props> = {
  active: (props: Props) => boolean,
  onDrop: (props: Props) => (item: any) => unknown,
};

type Result = {
  canDrop: boolean;
  onDragEnter?: (e: DragEvent) => boolean;
  onDrop?: (e: DragEvent) => boolean;
  onDragOver?: (e: DragEvent) => boolean;
  onDragLeave?: (e: DragEvent) => boolean;
};

export const useDroppable = <Props>(
  options: Options<Props>,
  type: string,
  props: Props,
): Result => {
  const [canDrop, setCanDrop] = useState(false);
  const [enterTarget, setEnterTarget] = useState(null);

  if (!options.active(props)) {
    return { canDrop: false };
  }

  const onDragEnter = (e: DragEvent) => {
    if (dragStore.type !== type) return;
    e.stopPropagation();
    e.preventDefault();
    setEnterTarget(e.target);
    setCanDrop(true);
  };

  const onDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const onDragLeave = (e) => {
    if (enterTarget === e.target) {
      e.stopPropagation();
      e.preventDefault();
      setCanDrop(false);
    }

    return false;
  };

  const onDrop = () => {
    if (dragStore.type !== type) return;
    setCanDrop(false);
    options.onDrop(props)(dragStore.item);
    dragStore.item = null;
    dragStore.type = '';
  };

  return {
    canDrop, onDragEnter, onDrop, onDragOver, onDragLeave,
  };
};

export default useDroppable;
