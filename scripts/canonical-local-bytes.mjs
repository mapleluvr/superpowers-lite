import path from "node:path";
import { TextDecoder } from "node:util";

export const BINARY_EXTENSIONS = new Set([
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
  ".woff",
  ".woff2",
]);

export function canonicalLocalBytes(bytes, relativePath = "") {
  const input = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  const extension = path.extname(relativePath).toLowerCase();
  if (BINARY_EXTENSIONS.has(extension) || input.includes(0)) return input;

  try {
    new TextDecoder("utf-8", { fatal: true }).decode(input);
  } catch {
    return input;
  }

  let crlfCount = 0;
  for (let index = 0; index + 1 < input.length; index += 1) {
    if (input[index] === 0x0d && input[index + 1] === 0x0a) crlfCount += 1;
  }
  if (crlfCount === 0) return input;

  const output = Buffer.allocUnsafe(input.length - crlfCount);
  let writeIndex = 0;
  for (let readIndex = 0; readIndex < input.length; readIndex += 1) {
    if (input[readIndex] === 0x0d && input[readIndex + 1] === 0x0a) continue;
    output[writeIndex] = input[readIndex];
    writeIndex += 1;
  }
  return output;
}
