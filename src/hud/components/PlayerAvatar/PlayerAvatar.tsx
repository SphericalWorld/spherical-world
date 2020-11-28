import { imgPlayer, avatar, lvlPlayer, lvl } from './playerAvatar.module.css';

const PlayerAvatar = (): JSX.Element => (
  <div className={avatar}>
    <div className={imgPlayer} />
    <div className={lvlPlayer}>
      <span className={lvl}>30</span>
    </div>
  </div>
);

export default PlayerAvatar;
