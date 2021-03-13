function openSocket1(eventHandler) {
    const webSocket = new WebSocket(`ws://${document.location.host}`);
    webSocket.onmessage = eventHandler;
    webSocket.onopen = function sendPing() {
        webSocket.send("Ping");
    };
}
export { openSocket1 as openSocket };
