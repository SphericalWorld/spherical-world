// @flow
import React from 'react';
import Button from '../../uiElements/Button';
import { mainMenu, wrapper } from './mainMenu.scss';

const MainMenu = () => (
  <div className={wrapper}>
    <nav className={mainMenu}>
      <Button text="return to game" />
      <Button text="video" />
      <Button text="audio" />
      <Button text="key bindings" />
      <Button text="exit" />
    </nav>
  </div>
);

export default MainMenu;
