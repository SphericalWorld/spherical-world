import { ReactNode, useMemo, useContext, useEffect, useCallback, createContext } from 'react';
import type Network from '../../../network';
import { useHudApi } from '../../HudApi';
import {
  ClientToServerMessage,
  ServerToClientMessages,
  ServerToClientMessage,
} from '../../../../common/protocol';

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

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({
  value,
  children,
}: {
  value: Network;
  children: ReactNode;
}): JSX.Element => {
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
    const eventListener = (e: ServerToClientMessages) => {
      if (e.type === ServerToClientMessage.chatMessage) {
        cb(e.data);
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
        socket.network.emit({ type: ClientToServerMessage.chatMessage, data: message });
      }
    },
    [socket, hudApi],
  );
};
