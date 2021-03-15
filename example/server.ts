import { isString } from "@taro/utils.ts";
import { createServer } from "@taro/server/server.ts";
import { Message } from "@taro/domain/domain.ts";
import { isCreateRoomMessage } from "./domain.ts";

const server = createServer({
  port: 8080,
  assetDirectory: `${Deno.cwd()}/example/assets`,
}, rawMessageHandler);

// TODO: Should this be part of taro lib?
function parseMessage(rawMessage: string): object | null {
  try {
    return JSON.parse(rawMessage);
  } catch (e) {
    console.error("Unable to parse JSON from message.", rawMessage);
    return null;
  }
}

function rawMessageHandler(rawMessage: string) {
  const message = parseMessage(rawMessage);

  if (isCreateRoomMessage(message)) {
    console.log("Create a room!", message);
  }
}
