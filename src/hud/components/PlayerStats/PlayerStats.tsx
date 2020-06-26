import React from 'react';
import { Label, ProgressBar } from '../../uiElements';
import {
  content,
  stats,
  statsInner,
  name,
  imgPlayer,
} from './playerStats.module.scss';

const PlayerStats = () => (
  <div className={content}>
    <div className={stats}>
      <div className={statsInner}>
        <div className={name}>
          <Label size="big">Players Name</Label>
        </div>
        <div>
          <ProgressBar currentValue={70} maxValue={100} />
        </div>
        <div>
          <ProgressBar type="mana" currentValue={203} maxValue={320} />
        </div>
      </div>
    </div>
    <div>
      <div className={imgPlayer} />
    </div>
  </div>
);

export default PlayerStats;
