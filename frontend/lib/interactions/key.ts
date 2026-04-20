import type { InteractionKind } from "./types";

export function compositeKey(kind: InteractionKind, id: string) {
  return `${kind}:${id}` as const;
}
