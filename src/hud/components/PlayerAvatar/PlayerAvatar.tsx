import React from 'react';
import { imgPlayer, avatar, lvlPlayer } from './playerAvatar.module.css';

const PlayerAvatar = (): JSX.Element => (
  <div className={avatar}>
    <div className={imgPlayer} />
    <div className={lvlPlayer}>30</div>
  </div>
);

export default PlayerAvatar;
