export interface Message {
  kind: string;
}

export function isOfKind<T>(messageKind: string) {
  return (message: any): message is T => {
    return message?.kind === messageKind;
  };
}
