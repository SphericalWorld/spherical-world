import React from 'react';
import { Label, ProgressBar } from '../../uiElements';
import { imgPlayer, avatar, lvlPlayer } from './playerAvatar.module.scss';

const PlayerAvatar = (): JSX.Element => (
  <div className={avatar}>
    <div className={imgPlayer} />
    <div className={lvlPlayer}>30</div>
  </div>
);

export default PlayerAvatar;
