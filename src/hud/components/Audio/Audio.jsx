// @flow strict
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { AUDIO } from './audioConstants';
import { setUIState } from '../../utils/StateRouter';
import Button from '../../uiElements/Button';
import Label from '../../uiElements/Label';
import Checkbox from '../../uiElements/Checkbox';
import InputRange from '../../uiElements/InputRange';
import ModalWindowMenu from '../ModalWindowMenu';
import {
  content,
  footerButtons,
  label,
  cbEnSound,
  master,
  effect,
  ambient,
  volume,
  labelVolume,
  inputVolume,
  volumes,
} from './audio.module.scss';

type DispatchProps = {|
  +setUIState: typeof setUIState,
|};

class Audio extends PureComponent<DispatchProps> {
  close = () => this.props.setUIState(AUDIO, false);

  render() {
    return (
      <ModalWindowMenu caption="Audio">
        <div className={content}>
          <div className={cbEnSound}>
            <Checkbox size="big"> enable sound</Checkbox>
          </div>
          <div className={volumes}>
            <div className={`${master} ${volume}`}>
              <Label size="big" className={labelVolume}>Master Volume</Label>
              <InputRange valueNum={30} className={inputVolume} />
            </div>
            <div className={`${effect} ${volume}`}>
              <Label size="big" className={labelVolume}>Effect Volume</Label>
              <InputRange valueNum={50} className={inputVolume} />
            </div>
            <div className={`${ambient} ${volume}`}>
              <Label size="big" className={labelVolume}>Ambient Volume</Label>
              <InputRange valueNum={100} className={inputVolume} />
            </div>
          </div>
          <div className={footerButtons}>
            <Button size="small">defaults</Button>
            <Label className={label} />
            <Button size="small">apply</Button>
            <Button size="small" onClick={this.close}>accept</Button>
            <Button size="small" onClick={this.close}>cancel</Button>
          </div>
        </div>
      </ModalWindowMenu>
    );
  }
}

const mapActions = {
  setUIState,
};

export default connect(null, mapActions)(Audio);
