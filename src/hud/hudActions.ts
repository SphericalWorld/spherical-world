import { HUD_DATA_UPDATED } from './hudConstants';

export const updateHudData = (data) => ({
  type: HUD_DATA_UPDATED,
  payload: data,
});
