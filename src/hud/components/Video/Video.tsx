import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import type { State } from '../../../reducers/rootReducer';
import { setUIState as doSetUIState } from '../../utils/StateRouter';
import { VIDEO } from './videoConstants';
import {
  Button,
  Label,
  Select,
} from '../../uiElements';
import ModalWindowMenu from '../ModalWindowMenu';
import {
  content,
  footerButtons,
  label,
  labelSelect,
  volumes,
} from './video.module.scss';

type Props = {
  setUIState: typeof doSetUIState,
};

const quality = [
  { value: '1', text: 'low' },
  { value: '2', text: 'medium' },
  { value: '3', text: 'high' },
];

const display = [
  { value: '1', text: 'window' },
  { value: '2', text: 'fullscreen' },
];


const Video = ({ setUIState }: Props) => {
  const close = useCallback(() => setUIState(VIDEO, false), [setUIState]);
  return (
    <ModalWindowMenu caption="Video">
      <div className={content}>
        <div className={volumes}>
          <div>
            <Label size="big" className={labelSelect}>display</Label>
            <Select options={display} onSelect={console.log} />
          </div>
          <div>
            <Label size="big" className={labelSelect}>texture quality</Label>
            <Select options={quality} onSelect={console.log} />
          </div>
          <div>
            <Label size="big" className={labelSelect}>effect quality </Label>
            <Select options={quality} onSelect={console.log} />
          </div>
        </div>
        <div className={footerButtons}>
          <Button size="small">defaults</Button>
          <Label className={label} />
          <Button size="small">apply</Button>
          <Button size="small" onClick={close}>accept</Button>
          <Button size="small" onClick={close}>cancel</Button>
        </div>
      </div>
    </ModalWindowMenu>
  );
};

const mapActions = {
  setUIState: doSetUIState,
};

export default connect<Props, {}, _, _, State, _>(null, mapActions)(Video);
