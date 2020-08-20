import React, { createContext, useContext } from 'react';
import type { World } from '../../common/ecs';

type HudAPI = {
  runCommand: (command: string) => void;
};

const api: HudAPI = {
  runCommand: () => {
    return null;
  },
};

const Context = createContext<HudAPI>(api);

const comandRegex = /^\/(\w+)/;
const paramsRegex = /\s+/g;

const getComand = (input: string) => {
  const data = comandRegex.exec(input);
  if (!data) {
    return [];
  }
  const paramsInput = input.replace(comandRegex, '');
  const paramsArray = paramsInput.split(paramsRegex).filter((el) => el !== '');
  return [data[1], ...paramsArray];
};

export const initHudAPI = (world: World): void => {
  api.runCommand = (input: string) => {
    const [command, ...params] = getComand(input);
    if (command === 'setDayTime') {
      world.dispatch({ type: 'SET_DAY_TIME', payload: params[0] });
    }
  };
};

export const HudAPIProvider = (): JSX.Element => <Context.Provider value={api} />;

export const useHudApi = (): HudAPI => useContext(Context);
