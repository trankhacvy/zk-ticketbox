import { customAlphabet } from "nanoid";

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export const nanoid = (chars?: number) => {
  return customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    chars || 7 // 7-character random string by default
  )();
};

export function truncateWallet(
  str: string,
  num: number,
  middle: boolean = false,
  maskChar: string = "."
) {
  if (str.length > num && str.length > 3) {
    if (!middle) {
      return `${str.substring(0, num)}${maskChar.repeat(3)}`;
    }

    const a = Math.round((num * 2) / 3);
    const b = num - a;

    return `${str.substring(0, a)}${maskChar.repeat(3)}${str.substring(
      str.length - b,
      str.length
    )}`;
  }

  return str;
}
