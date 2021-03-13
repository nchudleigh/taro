function openSocket(eventHandler) {
    const webSocket = new WebSocket(`ws://${document.location.host}`);
    webSocket.onmessage = eventHandler;
    webSocket.onopen = function sendPing() {
        webSocket.send("Ping");
    };
}
function eventHandler(event) {
    console.log(event);
}
openSocket(eventHandler);
