import React, { useCallback } from 'react';
import { useSetUIState } from '../../utils/StateRouter';
import { AUDIO } from './audioConstants';
import { Button, Label, Checkbox, InputRange } from '../../uiElements';
import ModalWindowMenu from '../ModalWindowMenu';
import {
  content,
  inner,
  footerButtons,
  label,
  cbEnSound,
  labelVolume,
  inputVolume,
  volumes,
} from './audio.module.scss';

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
              <InputRange value={30} className={inputVolume} />
            </div>
            <div>
              <Label size="big" className={labelVolume}>
                Effect Volume
              </Label>
              <InputRange value={50} className={inputVolume} />
            </div>
            <div>
              <Label size="big" className={labelVolume}>
                Ambient Volume
              </Label>
              <InputRange value={100} className={inputVolume} />
            </div>
          </div>
        </div>
        <div className={footerButtons}>
          <Button size="small">defaults</Button>
          <Label className={label} />
          <Button size="small">apply</Button>
          <Button size="small" onClick={close}>
            accept
          </Button>
          <Button size="small" onClick={close}>
            cancel
          </Button>
        </div>
      </div>
    </ModalWindowMenu>
  );
};

export default Audio;
