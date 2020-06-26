import React from 'react';
import classnames from 'classnames';
import {
  progressBar,
  content,
  percentInfo,
  mana,
  stripe,
  labelValue,
  labelPercent,
} from './progressBar.module.scss';

const colorRed = 'bf0000';
const colorYellow = 'bfbf00';
const colorGreen = '00bf00';

type Props = Readonly<{
  currentValue: number;
  maxValue: number;
  type?: 'hp' | 'mana';
  className?: string;
}>;

const decimalToHex = (decimal) => decimal.toString(16);
const hexToDecimal = (hex) => parseInt(hex, 16);

const mix = (colorMax, colorMin, weight = 50) => {
  let hexColor = '#';
  for (let i = 0; i <= 5; i += 2) {
    const pair1 = hexToDecimal(colorMax.substr(i, 2));
    const pair2 = hexToDecimal(colorMin.substr(i, 2));
    let combine = decimalToHex(
      Math.floor(pair2 + (pair1 - pair2) * (weight / 100.0)),
    );
    while (combine.length < 2) {
      combine = `0${combine}`;
    }
    hexColor += combine;
  }
  return hexColor;
};

const getColor = (percent) =>
  percent < 50
    ? mix(colorYellow, colorRed, percent)
    : mix(colorGreen, colorYellow, percent - 50);

const types = {
  mana,
};

type Styles = {
  width: string;
  background?: string;
};

const ProgressBar = ({
  type = 'hp',
  maxValue,
  currentValue,
  className = '',
}: Props) => {
  const percent = Math.floor((currentValue / maxValue) * 100);
  const style: Styles = {
    width: `${percent}%`,
  };
  let CSSColorClass = null;
  if (type === 'hp') {
    style.background = `${getColor(percent)}`;
  } else if (type) {
    CSSColorClass = types[type];
  }
  return (
    <div className={`${content} ${className}`}>
      <div className={progressBar}>
        <span style={style} className={classnames(CSSColorClass, stripe)} />
        <span className={labelValue}>{`${currentValue} / ${maxValue}`}</span>
      </div>
      <div className={percentInfo}>
        <span className={labelPercent}>{`${percent} %`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
