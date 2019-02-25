// @flow strict
import type { Node } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import Portal from '../../uiElements/Portal';
import { tooltip, wrapper, hidden } from './tooltip.module.scss';

type Props<P> = {|
  +children: Node,
  +tooltip: (P) => React$Element<*>,
  +tooltipProps?: P,
|};

type Ref = { current: null | HTMLDivElement };

const getOffset = (triggerRef: Ref, tooltipRef: Ref) => {
  if (!triggerRef.current) {
    return {};
  }
  const boundsRectTrigger = triggerRef.current.getBoundingClientRect();
  if (!tooltipRef.current) {
    return {};
  }

  return {
    left: boundsRectTrigger.left,
    top: boundsRectTrigger.top - tooltipRef.current.offsetHeight,
  };
};

const TooltipTrigger = <P>({ children, tooltip: Tooltip, tooltipProps = {} }: Props<P>) => {
  const [isHidden, setHidden] = useState(true);
  const [style, setStyle] = useState({});
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(
    () => {
      setStyle(getOffset(triggerRef, tooltipRef));
    },
    [isHidden],
  );

  return (
    <>
      <div
        ref={triggerRef}
        className={wrapper}
        onMouseOver={() => setHidden(false)}
        onFocus={() => setHidden(false)}
        onMouseOut={() => setHidden(true)}
        onBlur={() => setHidden(true)}
      >
        {children}
      </div>
      <Portal ref={tooltipRef} className={classnames(isHidden && hidden, tooltip)} style={style}>
        <Tooltip {...tooltipProps} />
      </Portal>
    </>
  );
};

export default TooltipTrigger;
