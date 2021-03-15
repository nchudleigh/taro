import {
  createMessageFactory,
  isOfKind,
  Message,
} from "@taro/domain/domain.ts";

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
export const makeCreateRoomMessage = createMessageFactory(
  MessageKind.CreateRoom,
);

export interface JoinRoomMessage extends Message {
  kind: MessageKind.JoinRoom;
}
export const isJoinRoomMessage = isOfKind<CreateRoomMessage>(
  MessageKind.JoinRoom,
);
export const makeJoinRoomMessage = createMessageFactory(
  MessageKind.JoinRoom,
);
