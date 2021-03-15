import { isNull } from "@taro/utils.ts";
import { openSocket } from "@taro/client/client.ts";
import { Message } from "@taro/domain/domain.ts";
import { isJoinRoomMessage, makeCreateRoomMessage } from "./domain.ts";

const webSocket = openSocket(messageHandler);

function messageHandler(message: Message) {
  console.log(message);

  if (isJoinRoomMessage(message)) {
    console.log("User joined", message);
  }
}

// Link up create room button
const createRoomButton = document.getElementById("create_room_button");
if (!isNull(createRoomButton)) {
  createRoomButton.onclick = function () {
    const createRoomMessage = makeCreateRoomMessage();
    webSocket.send(JSON.stringify(createRoomMessage));
  };
  console.log(createRoomButton);
}
