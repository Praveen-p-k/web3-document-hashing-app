import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";

export const generateAvatar = (pubKey: string): string => {
  return createAvatar(adventurer, {
    seed: pubKey,
  }).toDataUriSync();
};
