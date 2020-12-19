import { Route } from './utils/StateRouter';
import { MAIN_MENU } from './components/MainMenu/mainMenuConstants';
import { KEY_BINDINGS } from './components/KeyBindings/keyBindingsConstants';
import { AUDIO } from './components/Audio/audioConstants';
import { VIDEO } from './components/Video/videoConstants';
import { INVENTORY } from './components/Inventory/inventoryConstants';
import { CRAFT } from './components/Craft/craftConstants';
import MainMenu from './components/MainMenu';
import MainPanel from './components/MainPanel/MainPanel';
import PlayerStats from './components/PlayerStats/PlayerStats';
import MenuButton from './components/HamburgerMenuButton/HamburgerMenuButton';
import KeyBindings from './components/KeyBindings/KeyBindings';
import Audio from './components/Audio/Audio';
import Video from './components/Video/Video';
import Inventory from './components/Inventory/Inventory';
import DebugPanel from './components/Debug/DebugPanel';
import Chat from './components/Chat';
import Craft from './components/Craft';
import { Router } from './utils/StateRouter/StateRouter';

const Hud = ({ state }): JSX.Element => (
  <Router state={state}>
    <Route on={MAIN_MENU} component={MainMenu} />
    <Route on={KEY_BINDINGS} component={KeyBindings} />
    <Route on={INVENTORY} component={Inventory} />
    <Route on={AUDIO} component={Audio} />
    <Route on={VIDEO} component={Video} />
    <Route on={CRAFT} component={Craft} />
    <DebugPanel />
    <MainPanel />
    <Chat />
    <PlayerStats />
    <MenuButton />
  </Router>
);

export default Hud;
