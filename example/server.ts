import { Message } from "@taro/domain/domain.ts";
import { createServer, sendMessage, WebSocket } from "@taro/server/server.ts";
import { isCreateRoomMessage } from "./domain.ts";

const server = createServer({
  port: 8080,
  assetDirectory: `${Deno.cwd()}/example/assets`,
}, handleMessage);

// TODO: Build a router abstraction around this
function handleMessage(webSocket: WebSocket, message: Message) {
  if (isCreateRoomMessage(message)) {
    // call create room
    console.log(message);
    sendMessage(webSocket, { kind: "created_room" });
  }
}
