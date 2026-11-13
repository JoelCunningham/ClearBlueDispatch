"use client";

const maxCompressedSize = 700 * 1024;
const maxDimension = 1920;
const compressionQualities = [0.82, 0.68, 0.55, 0.42, 0.32, 0.24];

function getCompressedName(name: string) {
  const baseName = name.replace(/\.[^/.]+$/, "");
  return `${baseName}.jpg`;
}

export async function compressPhoto(photo: File): Promise<File> {
  if (photo.size <= maxCompressedSize) return photo;

  const imageUrl = URL.createObjectURL(photo);

  try {
    const image = new Image();
    image.decoding = "async";
    image.src = imageUrl;
    await image.decode();

    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    let width = Math.max(1, Math.round(image.naturalWidth * scale));
    let height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to prepare the image for upload.");
    }

    for (const quality of compressionQualities) {
      canvas.width = width;
      canvas.height = height;
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
      if (!blob) {
        throw new Error("Unable to compress the image.");
      }

      if (blob.size <= maxCompressedSize) {
        return new File([blob], getCompressedName(photo.name), {
          type: "image/jpeg",
          lastModified: photo.lastModified
        });
      }

      width = Math.max(1, Math.round(width * 0.85));
      height = Math.max(1, Math.round(height * 0.85));
    }

    throw new Error(`"${photo.name}" could not be reduced enough for upload.`);
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}
