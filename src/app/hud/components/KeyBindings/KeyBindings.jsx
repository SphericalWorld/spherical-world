// @flow
import React from 'react';
import Button from '../../uiElements/Button';
import Label from '../../uiElements/Label';
import ModalWindow from '../ModalWindow';
import {
  content,
  commandLine,
  header,
  footer,
  section,
  article,
  helpLine,
  footerButtons,
} from './keyBindings.scss';

const KeyBindings = () => (
  <ModalWindow caption="Key Bindings">
    <div className={content}>
      <header className={`${commandLine} ${header}`}>
        <Label text="command" />
        <Label text="key 1" />
        <Label text="key 2" />
      </header>
      <section className={section}>
        <section>
          <article className={article}>
            <Label text="movement keys" size="big" />
          </article>
          <div className={commandLine}>
            <Label text="action 1" />
            <Button text="A" size="small" />
            <Button text="B" size="small" />
          </div>
          <div className={commandLine}>
            <Label text="action 2" />
            <Button text="C" size="small" />
            <Button text="D" size="small" />
          </div>
          <div className={commandLine}>
            <Label text="action 3" />
            <Button text="E" size="small" />
            <Button text="F" size="small" />
          </div>

          <article className={article}>
            <Label text="movement keys" size="big" />
          </article>
          <div className={commandLine}>
            <Label text="action 1" />
            <Button text="A" size="small" />
            <Button text="B" size="small" />
          </div>
          <div className={commandLine}>
            <Label text="action 2" />
            <Button text="C" size="small" />
            <Button text="D" size="small" />
          </div>
          <div className={commandLine}>
            <Label text="action 3" />
            <Button text="E" size="small" />
            <Button text="F" size="small" />
          </div>

          <article className={article}>
            <Label text="movement keys" size="big" />
          </article>
          <div className={commandLine}>
            <Label text="action 1" />
            <Button text="A" size="small" />
            <Button text="B" size="small" />
          </div>
          <div className={commandLine}>
            <Label text="action 2" />
            <Button text="C" size="small" />
            <Button text="D" size="small" />
          </div>
          <div className={commandLine}>
            <Label text="action 3" />
            <Button text="E" size="small" />
            <Button text="F" size="small" />
          </div>

          <article className={article}>
            <Label text="movement keys" size="big" />
          </article>
          <div className={commandLine}>
            <Label text="action 1" />
            <Button text="A" size="small" />
            <Button text="B" size="small" />
          </div>
          <div className={commandLine}>
            <Label text="action 2" />
            <Button text="C" size="small" />
            <Button text="D" size="small" />
          </div>
          <div className={commandLine}>
            <Label text="action 3" />
            <Button text="E" size="small" />
            <Button text="F" size="small" />
          </div>
        </section>
      </section>
      <footer className={footer}>
        <div className={helpLine}>
          <Label text="press key to bind to command" size="small" />
        </div>
        <div className={footerButtons}>
          <Button text="reset to default" size="small" />
          <Label text=" " />
          <Button text="unbind key" size="small" />
          <Button text="OK" size="small" />
          <Button text="Cancel" size="small" />
        </div>
      </footer>
    </div>
  </ModalWindow>
);

export default KeyBindings;
