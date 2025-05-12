import { customAlphabet } from "nanoid";

export const nanoid = (chars?: number) => {
  return customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    chars || 10
  )();
};

/**

title: Accelerate Scale or Die
des: Accelerate Scale or Die
time: Mon, May 19-Tue, May 20
type: offline
location: United States



 */