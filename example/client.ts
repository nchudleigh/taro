import { isNull } from "@taro/utils.ts";
import { openSocket } from "@taro/client/client.ts";
import { isJoinRoomMessage, makeCreateRoomMessage } from "./domain.ts";

const webSocket = openSocket(messageHandler);

function messageHandler(rawMessage: MessageEvent) {
  // TODO: should this be a taro lib method?
  const message = JSON.parse(rawMessage.data);
  if (isJoinRoomMessage(message)) {
    console.log("User joined", message);
  }
}

// Link up create room button
const createRoomButton = document.getElementById("create_room_button");
console.log(createRoomButton);
if (!isNull(createRoomButton)) {
  createRoomButton.onclick = function () {
    const createRoomMessage = makeCreateRoomMessage();
    webSocket.send(JSON.stringify(createRoomMessage));
  };
  console.log(createRoomButton);
}

// function joinRoomHandler() {
//   const joinRoomMessage = makeJoinRoomMessage();
//   webSocket.send(JSON.stringify(joinRoomMessage));
// }
