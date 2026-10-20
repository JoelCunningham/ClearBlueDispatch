"use client";

import { useState } from "react";

import PrimaryButton from "@/components/buttons/primary-button";
import PhotoGalleryModal, { PhotoGalleryItem } from "@/components/photos/photo-gallery-modal";
import { DocketPhotoReference } from "@/features/dockets/types";

type DocketPhotoViewerProps = {
  docketId: number;
  photos: DocketPhotoReference[];
};

export default function DocketPhotoViewer({ docketId, photos }: DocketPhotoViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [urls, setUrls] = useState<Record<number, string>>({});
  const [error, setError] = useState("");

  if (photos.length === 0) return null;

  async function selectPhoto(index: number) {
    const photo = photos[index];
    if (!urls[photo.id]) {
      const response = await fetch(`/api/dockets/${docketId}/photos/${photo.id}`);
      if (!response.ok) {
        setError("Unable to load photo.");
        return;
      }
      const result = (await response.json()) as { url: string };
      setUrls(current => ({ ...current, [photo.id]: result.url }));
    }
    setSelectedIndex(index);
  }

  const gallery: PhotoGalleryItem[] = photos.map(photo => ({
    src: urls[photo.id] ?? "",
    alt: "Docket photo"
  }));

  return (
    <>
      <PrimaryButton text="View photos" secondary onClick={() => void selectPhoto(0)} />
      <PhotoGalleryModal
        photos={gallery}
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onSelect={index => void selectPhoto(index)}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </>
  );
}
