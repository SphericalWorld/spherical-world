import React, { useCallback } from 'react';
import { useSetUIState } from '../../utils/StateRouter';
import { AUDIO } from './audioConstants';
import { Label, Checkbox, InputRange } from '../../uiElements';
import ModalWindowMenu from '../ModalWindowMenu';
import { content, inner, cbEnSound, labelVolume, inputVolume, volumes } from './audio.module.scss';
import MenuFooterButtons from '../MenuFooterButtons';

const Audio = (): JSX.Element => {
  const setUIState = useSetUIState();
  const close = useCallback(() => setUIState(AUDIO, false), [setUIState]);
  return (
    <ModalWindowMenu caption="Audio">
      <div className={inner}>
        <div className={content}>
          <div className={cbEnSound}>
            <Checkbox size="big"> enable sound</Checkbox>
          </div>
          <div className={volumes}>
            <div>
              <Label size="big" className={labelVolume}>
                Master Volume
              </Label>
              <InputRange max={100} step={5} value={30} className={inputVolume} />
            </div>
            <div>
              <Label size="big" className={labelVolume}>
                Effect Volume
              </Label>
              <InputRange max={100} step={5} value={50} className={inputVolume} />
            </div>
            <div>
              <Label size="big" className={labelVolume}>
                Ambient Volume
              </Label>
              <InputRange max={100} step={5} value={100} className={inputVolume} />
            </div>
          </div>
        </div>
        <MenuFooterButtons close={close} />
      </div>
    </ModalWindowMenu>
  );
};

export default Audio;
