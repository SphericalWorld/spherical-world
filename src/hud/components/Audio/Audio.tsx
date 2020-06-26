import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import type { State } from '../../../reducers/rootReducer';
import { setUIState as doSetUIState } from '../../utils/StateRouter';
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

type Props = {
  setUIState: typeof doSetUIState;
};

const Audio = ({ setUIState }: Props) => {
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

const mapActions = {
  setUIState: doSetUIState,
};

export default connect<Props, {}, _, _, State, _>(null, mapActions)(Audio);
