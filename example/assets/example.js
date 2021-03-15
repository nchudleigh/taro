function isNull(maybeNull) {
    return maybeNull === null;
}
function openSocket(rawClientMessageHandler) {
    const webSocket = new WebSocket(`ws://${document.location.host}`);
    webSocket.onmessage = rawClientMessageHandler;
    webSocket.onopen = function sendPing() {
        webSocket.send("Ping");
    };
    return webSocket;
}
function isOfKind(messageKind) {
    return (message)=>{
        return message?.kind === messageKind;
    };
}
function createMessageFactory(messageKind) {
    return function(data) {
        return {
            kind: messageKind,
            ...data
        };
    };
}
var MessageKind;
(function(MessageKind1) {
    MessageKind1["CreateRoom"] = "create_room";
    MessageKind1["JoinRoom"] = "join_room";
})(MessageKind || (MessageKind = {
}));
const makeCreateRoomMessage = createMessageFactory(MessageKind.CreateRoom);
const isJoinRoomMessage = isOfKind(MessageKind.JoinRoom);
const webSocket = openSocket(messageHandler);
function messageHandler(rawMessage) {
    const message = JSON.parse(rawMessage.data);
    if (isJoinRoomMessage(message)) {
        console.log("User joined", message);
    }
}
const createRoomButton = document.getElementById("create_room_button");
if (!isNull(createRoomButton)) {
    createRoomButton.onclick = function() {
        const createRoomMessage = makeCreateRoomMessage();
        webSocket.send(JSON.stringify(createRoomMessage));
    };
    console.log(createRoomButton);
}
