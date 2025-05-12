import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const nanoid = (chars?: number) => {
  return customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    chars || 10 // 7-character random string by default
  )();
};

interface SolanaNFTMetadata {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
}

// Function to fetch and parse NFT metadata
export async function fetchNFTMetadata(
  metadataUri: string
): Promise<SolanaNFTMetadata> {
  try {
    const response = await fetch(metadataUri);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const metadata: SolanaNFTMetadata = await response.json();

    if (!metadata.name || !metadata.symbol || !metadata.image) {
      throw new Error("Invalid metadata structure: missing required fields");
    }

    return metadata;
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    throw error;
  }
}
