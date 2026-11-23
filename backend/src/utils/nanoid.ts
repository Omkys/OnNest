import { randomFillSync } from "crypto";

/** Lightweight nanoid-style ID generator (no external dependency). */
export function customAlphabet(alphabet: string, size: number) {
  return function generate(length = size): string {
    let id = "";
    const bytes = new Uint8Array(length);
    randomFillSync(bytes);
    for (let i = 0; i < length; i++) {
      id += alphabet[bytes[i]! % alphabet.length];
    }
    return id;
  };
}
