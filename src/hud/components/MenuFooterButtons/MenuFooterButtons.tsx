import React from 'react';
import { footerButtons, label } from './menuFooterButtons.module.scss';
import { Button, Label } from '../../uiElements';

type Props = Readonly<{
  close: () => unknown;
}>;

const MenuFooterButtons = ({ close }: Props): JSX.Element => {
  return (
    <footer className={footerButtons}>
      <Button size="small">reset to default</Button>
      <Label className={label} />
      <Button size="small">unbind key</Button>
      <Button size="small" onClick={close}>
        OK
      </Button>
      <Button size="small" onClick={close}>
        Cancel
      </Button>
    </footer>
  );
};

export default MenuFooterButtons;
