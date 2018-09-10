// @flow
import React from 'react';
import Button from '../../uiElements/Button';
import ModalWindow from '../ModalWindow';
import {
  content,
} from './mainMenu.scss';

const MainMenu = () => (
  <ModalWindow caption="Main Menu">
    <div className={content}>
      <Button text="return to game" />
      <Button text="video" />
      <Button text="audio" />
      <Button text="key bindings" />
      <Button text="exit" />
    </div>
  </ModalWindow>
);

export default MainMenu;
