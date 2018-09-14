// @flow
import React from 'react';
import Button from '../../uiElements/Button';
import Label from '../../uiElements/Label';
import ModalWindow from '../ModalWindow';
import {
  content,
  command,
  header,
  footer,
  section,
  commandGroup,
  helpLine,
  footerButtons,
  label,
  labelFirst,
  labelCommandGroup,
} from './keyBindings.scss';

const KeyBindings = () => (
  <ModalWindow caption="Key Bindings">
    <div className={content}>
      <header className={`${command} ${header}`}>
        <Label text="command" className={labelFirst} />
        <Label text="key 1" className={label} />
        <Label text="key 2" className={label} />
      </header>
      <section className={section}>
        <section>
          <article className={commandGroup}>
            <Label text="movement keys" size="big" className={labelCommandGroup} />
          </article>
          <div className={command}>
            <Label text="action 1" className={labelFirst} />
            <Button text="A" size="small" />
            <Button text="B" size="small" />
          </div>
          <div className={command}>
            <Label text="action 2" className={labelFirst} />
            <Button text="C" size="small" />
            <Button text="D" size="small" />
          </div>
          <div className={command}>
            <Label text="action 3" className={labelFirst} />
            <Button text="E" size="small" />
            <Button text="F" size="small" />
          </div>
          <article className={commandGroup}>
            <Label text="movement keys" size="big" className={labelCommandGroup} />
          </article>
          <div className={command}>
            <Label text="action 1" className={labelFirst} />
            <Button text="A" size="small" />
            <Button text="B" size="small" />
          </div>
          <div className={command}>
            <Label text="action 2" className={labelFirst} />
            <Button text="C" size="small" />
            <Button text="D" size="small" />
          </div>
          <div className={command}>
            <Label text="action 3" className={labelFirst} />
            <Button text="E" size="small" />
            <Button text="F" size="small" />
          </div>
          <article className={commandGroup}>
            <Label text="movement keys" size="big" className={labelCommandGroup} />
          </article>
          <div className={command}>
            <Label text="action 1" className={labelFirst} />
            <Button text="A" size="small" />
            <Button text="B" size="small" />
          </div>
          <div className={command}>
            <Label text="action 2" className={labelFirst} />
            <Button text="C" size="small" />
            <Button text="D" size="small" />
          </div>
          <div className={command}>
            <Label text="action 3" className={labelFirst} />
            <Button text="E" size="small" />
            <Button text="F" size="small" />
          </div>
          <article className={commandGroup}>
            <Label text="movement keys" size="big" className={labelCommandGroup} />
          </article>
          <div className={command}>
            <Label text="action 1" className={labelFirst} />
            <Button text="A" size="small" />
            <Button text="B" size="small" />
          </div>
          <div className={command}>
            <Label text="action 2" className={labelFirst} />
            <Button text="C" size="small" />
            <Button text="D" size="small" />
          </div>
          <div className={command}>
            <Label text="action 3" className={labelFirst} />
            <Button text="E" size="small" />
            <Button text="F" size="small" />
          </div>
        </section>
      </section>
      <footer className={footer}>
        <div className={helpLine}>
          <Label text="press key to bind to command" size="small" className={labelCommandGroup} />
        </div>
        <div className={footerButtons}>
          <Button text="reset to default" size="small" />
          <Label text=" " className={label} />
          <Button text="unbind key" size="small" />
          <Button text="OK" size="small" />
          <Button text="Cancel" size="small" />
        </div>
      </footer>
    </div>
  </ModalWindow>
);

export default KeyBindings;
