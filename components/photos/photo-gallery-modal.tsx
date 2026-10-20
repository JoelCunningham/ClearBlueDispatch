"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";

export type PhotoGalleryItem = {
  src: string;
  alt: string;
};

type PhotoGalleryModalProps = {
  photos: PhotoGalleryItem[];
  selectedIndex: number | null;
  onClose: () => void;
  onSelect: (index: number) => void;
};

export default function PhotoGalleryModal({ photos, selectedIndex, onClose, onSelect }: PhotoGalleryModalProps) {
  useEffect(() => {
    if (selectedIndex === null) return;
    const currentIndex = selectedIndex;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onSelect((currentIndex - 1 + photos.length) % photos.length);
      if (event.key === "ArrowRight") onSelect((currentIndex + 1) % photos.length);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onSelect, photos.length, selectedIndex]);

  if (selectedIndex === null || photos.length === 0) return null;

  const photo = photos[selectedIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo preview"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo preview"
        className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
      >
        <X className="size-6" />
      </button>

      <button
        type="button"
        disabled={photos.length < 2}
        onClick={event => {
          event.stopPropagation();
          onSelect((selectedIndex - 1 + photos.length) % photos.length);
        }}
        aria-label="Previous photo"
        className="absolute left-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 disabled:invisible"
      >
        <ChevronLeft className="size-7" />
      </button>

      <img
        src={photo.src}
        alt={photo.alt}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={event => event.stopPropagation()}
      />

      <button
        type="button"
        disabled={photos.length < 2}
        onClick={event => {
          event.stopPropagation();
          onSelect((selectedIndex + 1) % photos.length);
        }}
        aria-label="Next photo"
        className="absolute right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 disabled:invisible"
      >
        <ChevronRight className="size-7" />
      </button>

      <p className="absolute bottom-4 text-sm text-white">
        {selectedIndex + 1} / {photos.length}
      </p>
    </div>
  );
}
