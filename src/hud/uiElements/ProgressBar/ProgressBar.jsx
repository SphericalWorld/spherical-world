// @flow strict
import React from 'react';
import {
  progressBar,
  content,
  percentInfo,
  fullHP,
  lowHp,
  mana,
  labelValue,
  labelPercent,
} from './progressBar.module.scss';

type Props = {|
  +currentValue: number;
  +maxValue: number;
  +type?: string;
  +className?: string;
|}

const ProgressBar = ({
  type = 'HP',
  maxValue,
  currentValue,
  className = '',
}: Props) => {
  const percent = Math.floor(currentValue / maxValue * 100);
  const styles = { width: `${percent}%` };
  const spanHP = percent > 40 ? fullHP : lowHp;
  const progressBarType = type === 'mana' ? mana : spanHP;
  return (
    <div className={`${content} ${className}`}>
      <div className={progressBar}>
        <span style={styles} className={progressBarType} />
        <span className={labelValue}>
          {`${currentValue} / ${maxValue}`}
        </span>
      </div>
      <div className={percentInfo}>
        <span className={labelPercent}>
          {`${percent} %`}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
