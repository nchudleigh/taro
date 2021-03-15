import { isNull, isString } from "@taro/utils.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  WebSocket,
} from "std/ws/mod.ts";
import { ServerRequest } from "std/http/server.ts";
import { unpackMessage } from "@taro/server/message.ts";
import { isMessage, Message } from "@taro/domain/domain.ts";

export type { WebSocket };

export type ServerMessageHandler = (
  webSocket: WebSocket,
  message: Message,
) => void;

const socketConnections: WebSocket[] = [];

export function isWebSocketRequest(req: ServerRequest): boolean {
  if (req.headers.get("upgrade") == "websocket") {
    return true;
  }

  return false;
}

export async function handleSocket(
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
  registerNewConnection(conn, webSocket, serverMessageHandler);
}

function registerNewConnection(
  conn: Deno.Conn,
  webSocket: WebSocket,
  serverMessageHandler: ServerMessageHandler,
) {
  socketConnections.push(webSocket);
  console.log(webSocket);
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
    } else if (event instanceof Uint8Array) {
      console.log("Binary websocket events are not supported.", event);
    } else if (isWebSocketCloseEvent(event)) {
      console.log("ws:Close", event);
    } else {
      console.error("Unhandled websocket event type.", event);
    }
  }
}
