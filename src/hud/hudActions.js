// @flow
import { HUD_DATA_UPDATED, MENU_TOGGLED } from './hudConstants';

export const updateHudData = data => ({
  type: HUD_DATA_UPDATED,
  payload: data,
});

export const toggleMenu = (isToggled: boolean) => ({
  type: MENU_TOGGLED,
  payload: isToggled,
});
