import { isString } from "@taro/utils.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  WebSocket,
} from "std/ws/mod.ts";
import { ServerRequest } from "std/http/server.ts";

export type RawServerMessageHandler = (rawMessageEvent: string) => void;

const socketConnections: WebSocket[] = [];

export function isWebSocketRequest(req: ServerRequest): boolean {
  if (req.headers.get("upgrade") == "websocket") {
    return true;
  }

  return false;
}

export async function handleSocket(
  req: ServerRequest,
  rawServerMessageHandler: RawServerMessageHandler,
) {
  const { conn, r: bufReader, w: bufWriter, headers } = req;
  const webSocket = await acceptWebSocket({
    conn,
    bufReader,
    bufWriter,
    headers,
  });
  registerNewConnection(conn, webSocket, rawServerMessageHandler);
}

function registerNewConnection(
  conn: Deno.Conn,
  webSocket: WebSocket,
  rawServerMessageHandler: RawServerMessageHandler,
) {
  socketConnections.push(webSocket);
  console.log(webSocket);
  try {
    listenForEvents(webSocket, rawServerMessageHandler);
  } catch (e) {
    if (!webSocket.isClosed) {
      webSocket.close(1000);
    }
  }
}

async function listenForEvents(
  webSocket: WebSocket,
  rawServerMessageHandler: RawServerMessageHandler,
) {
  for await (const event of webSocket) {
    if (isString(event)) {
      rawServerMessageHandler(event);
    } else if (event instanceof Uint8Array) {
      console.log("Binary websocket events are not yet supported.", event);
    } else if (isWebSocketCloseEvent(event)) {
      console.log("ws:Close", event);
    } else {
      console.error("Unhandled websocket event type.", event);
    }
  }
}
