import { serve } from "std/http/server.ts";

import { handleHTTP } from "@taro/server/fileserver.ts";
import {
  handleSocket,
  isWebSocketRequest,
  ServerMessageHandler,
  WebSocket,
} from "@taro/server/websocket.ts";

import { Message } from "@taro/domain/domain.ts";
import { packMessage } from "@taro/domain/domain.ts";
import { isNull } from "@taro/utils.ts";

type serverOptions = {
  assetDirectory: string;
  port: number;
};

export type { WebSocket };

export async function createServer(
  options: serverOptions,
  serverMessageHandler: ServerMessageHandler,
) {
  console.log(`🍠 Taro Server listening at :${options.port}`);
  for await (const req of serve(`:${options.port}`)) {
    // If the request is requesting to upgrade to websocket
    // handle the connection request
    if (isWebSocketRequest(req)) {
      handleSocket(req, serverMessageHandler);
    } // Otherwise, serve static files
    else {
      handleHTTP(req, options.assetDirectory);
    }
  }
}

export function sendMessage(
  webSocket: WebSocket,
  message: Message,
) {
  const packagedMessage = packMessage(message);
  if (isNull(packagedMessage)) return;
  webSocket.send(packagedMessage);
}
