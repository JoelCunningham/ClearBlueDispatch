"use client";

import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import ErrorAlert from "@/components/alerts/error-alert";
import PrimaryButton from "@/components/buttons/primary-button";
import { useFormFieldErrors } from "@/components/forms/base-form";
import Input from "@/components/wrappers/input";
import PhotoGalleryModal, { PhotoGalleryItem } from "@/components/photos/photo-gallery-modal";
import { DocketPhotoPreview } from "@/features/dockets/types";

type PhotoInputProps = {
  id: string;
  maxPhotos: number;
  maxSizeMb: number;
  initialPhotos?: DocketPhotoPreview[];
  disabled?: boolean;
};

export default function PhotoInput({ id, maxPhotos, maxSizeMb, initialPhotos = [], disabled = false }: PhotoInputProps) {
  const fieldErrors = useFormFieldErrors(id);
  const errorId = `${id}-error`;
  const [photos, setPhotos] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState(initialPhotos);
  const [error, setError] = useState("");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrls = useMemo(() => photos.map(photo => URL.createObjectURL(photo)), [photos]);
  const gallery: PhotoGalleryItem[] = useMemo(
    () => [
      ...existingPhotos.map(photo => ({ src: photo.previewUrl, alt: "Existing docket photo" })),
      ...photos.map((photo, index) => ({ src: previewUrls[index], alt: photo.name }))
    ],
    [existingPhotos, photos, previewUrls]
  );

  useEffect(() => {
    return () => previewUrls.forEach(url => URL.revokeObjectURL(url));
  }, [previewUrls]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const selected = Array.from(input.files ?? []);

    if (selected.length === 0) return;

    const next = [...photos, ...selected];
    if (existingPhotos.length + next.length > maxPhotos) {
      setError(`You can attach up to ${maxPhotos} photos.`);
      return;
    }

    const maxSize = maxSizeMb * 1024 * 1024;
    const invalid = selected.find(photo => !photo.type.startsWith("image/") || photo.size === 0 || photo.size > maxSize);

    if (invalid) {
      setError(`Each photo must be an image no larger than ${maxSizeMb} MB.`);
      return;
    }

    setPhotos(next);
    setError("");

    const transfer = new DataTransfer();
    next.forEach(photo => transfer.items.add(photo));
    input.files = transfer.files;
  }

  function removePhoto(index: number) {
    const remaining = photos.filter((_, i) => i !== index);
    const input = inputRef.current;

    if (input) {
      const transfer = new DataTransfer();
      remaining.forEach(photo => transfer.items.add(photo));
      input.files = transfer.files;
    }

    setPhotos(remaining);
    setError("");
  }

  return (
    <Input id={id}>
      <div className="space-y-3">
        <input
          ref={inputRef}
          id={id}
          name={id}
          type="file"
          accept="image/*;capture=camera"
          multiple
          disabled={disabled}
          onChange={handleChange}
          aria-invalid={fieldErrors.length > 0}
          aria-describedby={fieldErrors.length > 0 ? errorId : undefined}
          className="sr-only"
        />

        {existingPhotos.map(photo => (
          <div key={photo.blobId} className="flex items-center justify-between gap-3 rounded-md border p-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(existingPhotos.findIndex(existing => existing.blobId === photo.blobId))}
                aria-label="Enlarge existing docket photo"
                className="shrink-0"
              >
                <img src={photo.previewUrl} alt="Existing docket photo" className="size-10 rounded object-cover border" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-sm">Existing photo</p>
                <p className="text-xs text-muted-foreground">{(photo.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>

            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setExistingPhotos(remaining => remaining.filter(existing => existing.blobId !== photo.blobId));
                setError("");
              }}
              aria-label="Remove existing photo"
              className="text-muted-foreground hover:text-destructive shrink-0"
            >
              <X className="size-4" />
            </button>
            <input type="hidden" name={`${id}-existing`} value={JSON.stringify(photo)} />
          </div>
        ))}

        {photos.map((photo, index) => {
          const previewUrl = previewUrls[index];

          return (
            <div key={`${photo.name}-${index}`} className="flex items-center justify-between gap-3 rounded-md border p-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIndex(existingPhotos.length + index)}
                  aria-label={`Enlarge ${photo.name}`}
                  className="shrink-0"
                >
                  <img src={previewUrl} alt={photo.name} className="size-10 rounded object-cover border" />
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm">{photo.name}</p>
                  <p className="text-xs text-muted-foreground">{(photo.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>

              <button
                type="button"
                disabled={disabled}
                onClick={() => removePhoto(index)}
                aria-label={`Remove ${photo.name}`}
                className="text-muted-foreground hover:text-destructive shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>
          );
        })}

        <PrimaryButton text="Add photos" onClick={() => inputRef.current?.click()} secondary />

        {error && <ErrorAlert text={error} />}
      </div>

      <PhotoGalleryModal
        photos={gallery}
        selectedIndex={selectedPhotoIndex}
        onClose={() => setSelectedPhotoIndex(null)}
        onSelect={setSelectedPhotoIndex}
      />
    </Input>
  );
}
