import React, { useCallback } from 'react';
import { VIDEO } from './videoConstants';
import { Label, Select } from '../../uiElements';
import ModalWindowMenu from '../ModalWindowMenu';
import { labelSelect, volumes } from './video.module.css';
import { useSetUIState } from '../../utils/StateRouter';
import MenuFooterButtons from '../MenuFooterButtons';
import ModalWindowInnerContent from '../ModalWindowInnerContent/ModalWindowInnerContent';

const quality = [
  { value: '1', text: 'low' },
  { value: '2', text: 'medium' },
  { value: '3', text: 'high' },
];

const display = [
  { value: '1', text: 'window' },
  { value: '2', text: 'fullscreen' },
];

const Video = (): JSX.Element => {
  const setUIState = useSetUIState();
  const close = useCallback(() => setUIState(VIDEO, false), [setUIState]);

  return (
    <ModalWindowMenu caption="Video">
      <ModalWindowInnerContent>
        <div className={volumes}>
          <div>
            <Label size="big" className={labelSelect}>
              display
            </Label>
            <Select options={display} onSelect={console.log} />
          </div>
          <div>
            <Label size="big" className={labelSelect}>
              texture quality
            </Label>
            <Select options={quality} onSelect={console.log} />
          </div>
          <div>
            <Label size="big" className={labelSelect}>
              effect quality{' '}
            </Label>
            <Select options={quality} onSelect={console.log} />
          </div>
        </div>
        <MenuFooterButtons close={close} />
      </ModalWindowInnerContent>
    </ModalWindowMenu>
  );
};

export default Video;
