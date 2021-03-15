function isNull(maybeNull) {
    return maybeNull === null;
}
function isObject(maybeObject) {
    return typeof maybeObject === "object";
}
function isMessage(maybeMessage) {
    return isObject(maybeMessage) && typeof maybeMessage.kind === "string";
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
function unpackMessage(messageString) {
    try {
        return JSON.parse(messageString);
    } catch (e) {
        console.error("Unable to unpack message.", messageString);
        return null;
    }
}
function openSocket(clientMessageHandler) {
    const webSocket = new WebSocket(`ws://${document.location.host}`);
    webSocket.onmessage = (event)=>{
        const message = unpackMessage(event.data);
        if (isMessage(message)) clientMessageHandler(message);
        else console.error("Message not recognized.", message);
    };
    return webSocket;
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
function messageHandler(message) {
    console.log(message);
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
