import { forwardRef, ReactNode } from 'react';
import ReactDOM from 'react-dom';

const portalRoot = document.getElementById('hud') || document.body;
if (!portalRoot) {
  throw new Error('root element not found');
}

type Props = Readonly<{
  children: ReactNode;
}>;

const Portal = ({ children, ...props }: Props, ref) =>
  ReactDOM.createPortal(
    <div {...props}>
      <div ref={ref}>{children}</div>
    </div>,
    portalRoot,
  );

export default forwardRef<Props, HTMLDivElement>(Portal);
