import { serve } from "std/http/server.ts";
import { ServerRequest } from "std/http/server.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  WebSocket,
} from "std/ws/mod.ts";

import { handleHTTP } from "@taro/server/fileserver.ts";
import { isNull, isString } from "@taro/utils.ts";

import {
  isMessage,
  Message,
  packMessage,
  unpackMessage,
} from "@taro/domain/domain.ts";

interface ServerOptions {
  assetDirectory: string;
  port: number;
}

export type { WebSocket };

export interface Server {
  options: ServerOptions;
  connections: WebSocket[];
}

export type ServerMessageHandler = (
  webSocket: WebSocket,
  message: Message,
) => void;

export function createServer(
  options: ServerOptions,
): Server {
  return {
    options,
    connections: [],
  };
}

export async function startServer(
  server: Server,
  serverMessageHandler: ServerMessageHandler,
) {
  console.log(`🍠 Taro Server listening at :${server.options.port}`);
  for await (const req of serve(`:${server.options.port}`)) {
    // If the request is requesting to upgrade to websocket
    // handle the connection request
    if (isWebSocketRequest(req)) {
      handleSocket(server, req, serverMessageHandler);
    } // Otherwise, serve static files
    else {
      handleHTTP(req, server.options.assetDirectory);
    }
  }
}

export function broadcastMessage(
  server: Server,
  message: Message,
) {
  server.connections.forEach((webSocket) => sendMessage(webSocket, message));
}

export function sendMessage(
  webSocket: WebSocket,
  message: Message,
) {
  const packagedMessage = packMessage(message);
  if (isNull(packagedMessage)) return;
  webSocket.send(packagedMessage);
}

export function isWebSocketRequest(req: ServerRequest): boolean {
  if (req.headers.get("upgrade") == "websocket") {
    return true;
  }
  return false;
}

export async function handleSocket(
  server: Server,
  req: ServerRequest,
  serverMessageHandler: ServerMessageHandler,
) {
  const { conn, r: bufReader, w: bufWriter, headers } = req;
  const webSocket = await acceptWebSocket({
    conn,
    bufReader,
    bufWriter,
    headers,
  });
  registerNewConnection(server, webSocket, serverMessageHandler);
}

function registerNewConnection(
  server: Server,
  webSocket: WebSocket,
  serverMessageHandler: ServerMessageHandler,
) {
  server.connections.push(webSocket);
  try {
    listenForEvents(webSocket, serverMessageHandler);
  } catch (e) {
    if (!webSocket.isClosed) {
      webSocket.close(1000);
    }
  }
}

async function listenForEvents(
  webSocket: WebSocket,
  messageHandler: ServerMessageHandler,
) {
  for await (const event of webSocket) {
    if (isString(event)) {
      const message = unpackMessage(event);
      if (isMessage(message)) messageHandler(webSocket, message);
      else console.error("Message not recognized.", message);
    } else if (event instanceof Uint8Array) {
      console.log("Binary websocket events are not supported.", event);
    } else if (isWebSocketCloseEvent(event)) {
      console.log("ws:Close", event);
    } else {
      console.error("Unhandled websocket event type.", event);
    }
  }
}
