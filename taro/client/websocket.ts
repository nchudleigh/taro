import { isMessage, Message, unpackMessage } from "@taro/domain/domain.ts";

type ClientMessageHandler = (message: Message) => void;

export function openSocket(clientMessageHandler: ClientMessageHandler) {
  const webSocket = new WebSocket(`ws://${document.location.host}`);
  webSocket.onmessage = (event) => {
    const message = unpackMessage(event.data);
    if (isMessage(message)) clientMessageHandler(message);
    else console.error("Message not recognized.", message);
  };
  // webSocket.onopen
  return webSocket;
}
