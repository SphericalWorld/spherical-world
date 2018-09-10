// @flow
import React from 'react';
import Button from '../../uiElements/Button';
import ModalWindow from '../ModalWindow';
import {
  contentMenu,
} from './mainMenu.scss';

const MainMenu = () => (
  <ModalWindow text="Main Menu">
    <div className={contentMenu}>
      <Button text="return to game" />
      <Button text="video" />
      <Button text="audio" />
      <Button text="key bindings" />
      <Button text="exit" />
    </div>
  </ModalWindow>
);

export default MainMenu;
