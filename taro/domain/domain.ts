import { isOfKind, Message } from "@taro/domain/router.ts";

// rawin'
type MessageHandler = (messageEvent: Message) => void;

export type { Message, MessageHandler };
export { isOfKind };
