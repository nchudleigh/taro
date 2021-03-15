import { isOfKind, Message } from "@taro/domain/domain.ts";

enum MessageKind {
  CreateRoom = "create_room",
  JoinRoom = "join_room",
}

export interface CreateRoomMessage extends Message {
  kind: MessageKind.CreateRoom;
}
export const isCreateRoomMessage = isOfKind<CreateRoomMessage>(
  MessageKind.CreateRoom,
);
export function makeCreateRoomMessage(): CreateRoomMessage {
  return {
    kind: MessageKind.CreateRoom,
  };
}

export interface JoinRoomMessage extends Message {
  kind: MessageKind.JoinRoom;
}
export const isJoinRoomMessage = isOfKind<CreateRoomMessage>(
  MessageKind.JoinRoom,
);
