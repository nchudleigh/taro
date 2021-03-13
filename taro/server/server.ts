import { serve } from "std/http/server.ts";

import { handleHTTP } from "@taro/server/fileserver.ts";
import { handleSocket, isWebSocketRequest } from "@taro/server/websocket.ts";

type serverOptions = {
  assetDirectory: string;
  port: number;
};

export async function createServer(options: serverOptions) {
  console.log(`🍠 Taro Server listening at :${options.port}`);
  for await (const req of serve(`:${options.port}`)) {
    // If the request is requesting to upgrade to websocket
    // handle the connection request
    if (isWebSocketRequest(req)) {
      handleSocket(req);
    } // Otherwise, serve static files
    else {
      handleHTTP(req, options.assetDirectory);
    }
  }
}
