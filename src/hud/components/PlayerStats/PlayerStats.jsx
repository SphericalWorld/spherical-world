// @flow strict
import React from 'react';
import {
  Button,
  Label,
  Select,
  ProgressBar,
} from '../../uiElements';
import {
  content,
  stats,
  statsInner,
  name,
  hp,
  mana,
  imgPlayer,
} from './playerStats.module.scss';


const PlayerStats = () => (
  <div className={content}>
    <div className={stats}>
      <div className={statsInner}>
        <div className={name}>
          <Label size="big">Players Name</Label>
        </div>
        <div className={hp}>
          <ProgressBar currentValue={70} maxValue={100} />
        </div>
        <div className={mana}>
          <ProgressBar kind="mana" currentValue={203} maxValue={320} />
        </div>
      </div>
    </div>
    <div>
      <div className={imgPlayer} />
    </div>
  </div>
);

export default PlayerStats;
