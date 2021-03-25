import { Message } from "@taro/domain/domain.ts";
import {
  broadcastMessage,
  createServer,
  sendMessage,
  startServer,
  WebSocket,
} from "@taro/server/server.ts";
import {
  isCreateRoomMessage,
  isJoinRoomMessage,
  makeCreateRoomMessage,
  makeJoinRoomMessage,
} from "./domain.ts";

const server = createServer({
  port: 8080,
  assetDirectory: `${Deno.cwd()}/example/assets`,
});

startServer(server, (webSocket: WebSocket, message: Message) => {
  if (isCreateRoomMessage(message)) {
    // call create room
    console.log(message);
    makeCreateRoomMessage();
  }
  if (isJoinRoomMessage(message)) {
    console.log(message);
    // Find room, do logic to move person to room
    // for each connection in the room
    // webSocket.broadcast(message)
    broadcastMessage(server, message);
  }
});
