import { isObject } from "@taro/utils.ts";
export type { Message, MessageHandler };
export { createMessageFactory, isOfKind, packMessage, unpackMessage };

type MessageHandler = (messageEvent: Message) => void;

interface Message {
  kind: string;
}

export function isMessage(maybeMessage: unknown): maybeMessage is Message {
  return (
    isObject(maybeMessage) &&
    typeof maybeMessage.kind === "string"
  );
}

function isOfKind<T>(messageKind: string) {
  return (message: any): message is T => {
    return message?.kind === messageKind;
  };
}

type MessageFactory = (data?: Record<string, unknown>) => Message;

function createMessageFactory(
  messageKind: string,
): MessageFactory {
  return function (data?: Record<string, unknown>): Message {
    return {
      kind: messageKind,
      ...data,
    };
  };
}

function packMessage(
  message: Message,
): string | null {
  try {
    return JSON.stringify(message);
  } catch (e) {
    console.error("Unable to pack message.", message);
    return null;
  }
}

function unpackMessage(
  messageString: string,
): Record<string, unknown> | null {
  try {
    return JSON.parse(messageString);
  } catch (e) {
    console.error("Unable to unpack message.", messageString);
    return null;
  }
}
