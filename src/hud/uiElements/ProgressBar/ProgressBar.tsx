import classnames from 'classnames';
import {
  progressBar,
  content,
  percentInfo,
  mana,
  stripe,
  labelValue,
  labelPercent,
} from './progressBar.module.css';
import { fontMain } from '../../styles/fonts.module.css';

const colorRed = 'bf0000';
const colorYellow = 'bfbf00';
const colorGreen = '00bf00';

type Props = Readonly<{
  currentValue: number;
  maxValue: number;
  type?: 'hp' | 'mana';
  className?: string;
}>;

const decimalToHex = (decimal: number) => decimal.toString(16);
const hexToDecimal = (hex: string) => parseInt(hex, 16);

const mix = (colorMax: string, colorMin: string, weight = 50) => {
  let hexColor = '#';
  for (let i = 0; i <= 5; i += 2) {
    const pair1 = hexToDecimal(colorMax.substr(i, 2));
    const pair2 = hexToDecimal(colorMin.substr(i, 2));
    let combine = decimalToHex(Math.floor(pair2 + (pair1 - pair2) * (weight / 100.0)));
    while (combine.length < 2) {
      combine = `0${combine}`;
    }
    hexColor += combine;
  }
  return hexColor;
};

const getColor = (percent: number) =>
  percent < 50 ? mix(colorYellow, colorRed, percent) : mix(colorGreen, colorYellow, percent - 50);

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
}: Props): JSX.Element => {
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
        <span className={classnames(labelValue, fontMain)}>{`${currentValue} / ${maxValue}`}</span>
      </div>
      <div className={percentInfo}>
        <span className={classnames(labelPercent, fontMain)}>{`${percent} %`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
