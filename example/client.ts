import { isNull } from "@taro/utils.ts";
import { openSocket } from "@taro/client/client.ts";
import { Message } from "@taro/domain/domain.ts";
import {
  isJoinRoomMessage,
  makeCreateRoomMessage,
  makeJoinRoomMessage,
} from "./domain.ts";

const webSocket = openSocket(messageHandler);

function messageHandler(message: Message) {
  console.log(message);

  if (isJoinRoomMessage(message)) {
    console.log("User joined", message);
  }
}

const createRoomButton = document.getElementById("create_room_button");
if (!isNull(createRoomButton)) {
  createRoomButton.onclick = function () {
    const createRoomMessage = makeCreateRoomMessage();
    webSocket.send(JSON.stringify(createRoomMessage));
  };
}

const joinRoomButton = document.getElementById("join_room_button");
if (!isNull(joinRoomButton)) {
  joinRoomButton.onclick = function () {
    const joinRoomMessage = makeJoinRoomMessage();
    webSocket.send(JSON.stringify(joinRoomMessage));
  };
}
