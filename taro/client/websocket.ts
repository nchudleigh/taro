type EventHandler = (event: MessageEvent) => void;

export function openSocket(eventHandler: EventHandler) {
  const webSocket = new WebSocket(`ws://${document.location.host}`);
  webSocket.onmessage = eventHandler;
  webSocket.onopen = function sendPing() {
    webSocket.send("Ping");
  };
}
