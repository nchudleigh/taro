export type RawClientMessageHandler = (rawMessageEvent: MessageEvent) => void;

export function openSocket(rawClientMessageHandler: RawClientMessageHandler) {
  const webSocket = new WebSocket(`ws://${document.location.host}`);
  webSocket.onmessage = rawClientMessageHandler;
  webSocket.onopen = function sendPing() {
    webSocket.send("Ping");
  };
  return webSocket;
}
