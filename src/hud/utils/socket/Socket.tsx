import React, { ReactNode, useMemo, useContext, useEffect, useCallback } from 'react';
import Network, { NetworkEvent } from '../../../network';
import { useHudApi } from '../../HudApi';

type Socket = Readonly<{
  network: Network;
}>;

export type IncomingMessage = {
  id: string;
  text: string;
  time: number;
  from: {
    id: string;
    name: string;
  };
};

const SocketContext = React.createContext<Socket | null>(null);

export const SocketProvider = ({ value, children }: { value: Network; children: ReactNode }) => {
  const socket = useMemo(
    () => ({
      network: value,
    }),
    [value],
  );
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useMessage = (
  cb: (message: IncomingMessage) => unknown,
  deps: ReadonlyArray<unknown> = [],
): void => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;
    const eventListener = (e: NetworkEvent) => {
      // console.log(e.type);
      if (e.type === 'CHAT_MESSAGE') {
        cb(e.payload.data);
      }
    };
    socket.network.addEventListener(eventListener);
    return () => socket.network.removeEventListener(eventListener);
  }, [socket, cb, ...deps]);
};

export const useSocketSend = (): ((message: string) => unknown) => {
  const socket = useContext(SocketContext);
  const hudApi = useHudApi();

  return useCallback(
    (message: string) => {
      if (!socket) return;
      if (message.startsWith('/')) {
        hudApi.runCommand(message);
      } else {
        socket.network.emit('CHAT_MESSAGE', message);
      }
    },
    [socket, hudApi],
  );
};
