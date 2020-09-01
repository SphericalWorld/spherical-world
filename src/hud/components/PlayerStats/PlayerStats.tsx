import React from 'react';
import { Label, ProgressBar } from '../../uiElements';
import PlayerAvatar from '../PlayerAvatar';
import { content, stats, statsInner, name } from './playerStats.module.css';

const PlayerStats = (): JSX.Element => (
  <div className={content}>
    <PlayerAvatar />
    <div className={stats}>
      <div>
        <div className={name}>
          <Label size="big">Players Name</Label>
        </div>
        <div className={statsInner}>
          <div>
            <ProgressBar currentValue={70} maxValue={100} />
          </div>
          <div>
            <ProgressBar type="mana" currentValue={203} maxValue={320} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PlayerStats;
