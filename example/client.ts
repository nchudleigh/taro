import { openSocket } from "@taro/client/client.ts";

function eventHandler(event: MessageEvent) {
  console.log(event);
}

openSocket(eventHandler);
