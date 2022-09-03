import WebSocket, { WebSocketServer } from 'ws';

type WsContext = {
  server: WebSocket.Server;
  socket?: WebSocket.WebSocket;
  state: Record<string, any>;
};

export interface WsHandlers {
  onConnect?: (ctx: WsContext) => void;
  onClose?: (ctx: WsContext) => void;
  onMessage?: (ctx: WsContext, msg: { data: any; isBin: boolean }) => void;
  onError?: (ctx: WsContext, err: Error) => void;
}

export interface WsConfig {
  options: Omit<WebSocket.ServerOptions, 'host' | 'port'>;
  handlers: WsHandlers;
}

export const handleOnConnect = (
  server: WebSocketServer,
  socket: WebSocket.WebSocket,
  config: WsConfig,
  state: Record<string, any>,
) => {
  if (config.handlers.onConnect) {
    config.handlers.onConnect({
      server,
      socket,
      state,
    });
  }
};

export const handleOnClose = (
  server: WebSocketServer,
  socket: WebSocket.WebSocket | undefined,
  config: WsConfig,
  state: Record<string, any>,
) => {
  if (config.handlers.onClose) {
    config.handlers.onClose({
      server,
      socket,
      state,
    });
  }
};

export const handleOnError = (
  server: WebSocketServer,
  socket: WebSocket.WebSocket | undefined,
  config: WsConfig,
  state: Record<string, any>,
  err: Error,
) => {
  if (config.handlers.onError) {
    config.handlers.onError(
      {
        server,
        socket,
        state,
      },
      err,
    );
  }
};

export const handleOnMessage = <T = any>(
  server: WebSocketServer,
  socket: WebSocket.WebSocket,
  config: WsConfig,
  state: Record<string, any>,
  message: { data: T; isBin: boolean },
) => {
  if (config.handlers.onMessage) {
    config.handlers.onMessage(
      {
        server,
        socket,
        state,
      },
      message,
    );
  }
};
