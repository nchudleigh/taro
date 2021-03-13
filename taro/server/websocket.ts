import { isString } from "@taro/utils.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  WebSocket,
} from "std/ws/mod.ts";
import { ServerRequest } from "std/http/server.ts";

const socketConnections: WebSocket[] = [];

export function isWebSocketRequest(req: ServerRequest): boolean {
  if (req.headers.get("upgrade") == "websocket") {
    return true;
  }

  return false;
}

export async function handleSocket(req: ServerRequest) {
  const { conn, r: bufReader, w: bufWriter, headers } = req;
  const webSocket = await acceptWebSocket({
    conn,
    bufReader,
    bufWriter,
    headers,
  });
  console.log("registerNewConnection");
  registerNewConnection(conn, webSocket);
}

function registerNewConnection(conn: Deno.Conn, webSocket: WebSocket) {
  socketConnections.push(webSocket);
  console.log(webSocket);
  try {
    listenForEvents(webSocket);
  } catch (e) {
    if (!webSocket.isClosed) {
      webSocket.close(1000);
    }
  }
}

async function listenForEvents(webSocket: WebSocket) {
  for await (const event of webSocket) {
    if (isString(event)) {
      console.log("string", event);
      webSocket.send("Pong");
    } else if (event instanceof Uint8Array) {
      console.log("ws:Binary", event);
    } else if (isWebSocketPingEvent(event)) {
      console.log("ws:Ping", event);
    } else if (isWebSocketCloseEvent(event)) {
      console.log("ws:Close", event);
    } else {
      console.error("Connection.ts: Unhandled websocket event type");
    }
  }
}
