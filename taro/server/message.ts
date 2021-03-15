import { Message } from "@taro/domain/domain.ts";

export function packMessage(
  message: Message,
): string | null {
  try {
    return JSON.stringify(message);
  } catch (e) {
    console.error("Unable to pack message.", message);
    return null;
  }
}

export function unpackMessage(
  messageString: string,
): Record<string, unknown> | null {
  try {
    return JSON.parse(messageString);
  } catch (e) {
    console.error("Unable to unpack message.", messageString);
    return null;
  }
}
