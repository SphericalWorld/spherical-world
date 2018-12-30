// @flow strict
import React from 'react';
import { Route } from './utils/StateRouter';
import { MAIN_MENU } from './components/MainMenu/mainMenuConstants';
import { KEY_BINDINGS } from './components/KeyBindings/keyBindingsConstants';
import { AUDIO } from './components/Audio/audioConstants';
import { INVENTORY } from './components/Inventory/inventoryConstants';
import MainMenu from './components/MainMenu';
import MainPanel from './components/MainPanel/MainPanel';
import KeyBindings from './components/KeyBindings/KeyBindings';
import Audio from './components/Audio/Audio';
import Inventory from './components/Inventory/Inventory';

const Hud = () => (
  <div>
    <Route on={MAIN_MENU} component={MainMenu} />
    <Route on={KEY_BINDINGS} component={KeyBindings} />
    <Route on={INVENTORY} component={Inventory} />
    <Route on={AUDIO} component={Audio} />
    <MainPanel />
  </div>
);

export default Hud;
