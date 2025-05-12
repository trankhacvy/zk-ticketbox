import { IMGBB_API_KEY } from "@/constants/env";
import { toast } from "sonner";

export async function uploadImage(file: File): Promise<string | null> {
  if (!IMGBB_API_KEY) {
    toast.error("Image upload is not configured");
    return null;
  }

  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("key", IMGBB_API_KEY);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("Failed to upload image");
    return null;
  }
}

export interface PumpFunTokenOptions {
  twitter?: string;
  telegram?: string;
  website?: string;
  initialLiquiditySOL?: number;
  slippageBps?: number;
  priorityFee?: number;
}

export async function uploadMetadata(
  tokenName: string,
  tokenTicker: string,
  description: string,
  imageUrl: string,
  options?: PumpFunTokenOptions
): Promise<any> {
  const formData = new URLSearchParams();

  formData.append("name", tokenName);
  formData.append("symbol", tokenTicker);
  formData.append("description", description);
  formData.append("showName", "true");

  if (options?.twitter) {
    formData.append("twitter", options.twitter);
  }
  if (options?.telegram) {
    formData.append("telegram", options.telegram);
  }
  if (options?.website) {
    formData.append("website", options.website);
  }

  let imageResponse;

  for (let attempt = 1; attempt <= 5; attempt++) {
    imageResponse = await fetch(imageUrl);

    if (imageResponse && imageResponse.ok) {
      break;
    }

    if (attempt === 5) {
      throw new Error(`Image fetch failed : ${imageResponse.statusText}`);
    }
  }

  const imageBlob = await imageResponse!.blob();

  const files = {
    file: new File([imageBlob], "token_image.png", { type: "image/png" }),
  };

  const finalFormData = new FormData();
  for (const [key, value] of formData.entries()) {
    finalFormData.append(key, value);
  }

  if (files?.file) {
    finalFormData.append("file", files.file);
  }

  const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
    method: "POST",
    body: finalFormData,
  });

  if (!metadataResponse.ok) {
    throw new Error(`Metadata upload failed: ${metadataResponse.statusText}`);
  }

  return (await metadataResponse.json()) as {
    metadata: {
      name: string;
      symbol: string;
      description: string;
      image: string;
      showName: boolean;
      createdOn: string;
      website: string;
    };
    metadataUri: string;
  };
}
