"use client";

import { X } from "lucide-react";
import { useRef, useState } from "react";

import ErrorAlert from "@/components/alerts/error-alert";
import PrimaryButton from "@/components/buttons/primary-button";
import { useFormFieldErrors } from "@/components/forms/base-form";
import Input from "@/components/wrappers/input";
import { compressPhoto } from "@/lib/utils/compression-utils";

type PhotoInputProps = {
  id: string;
  maxPhotos: number;
  maxSizeMb: number;
  disabled?: boolean;
};

export default function PhotoInput({ id, maxPhotos, maxSizeMb, disabled = false }: PhotoInputProps) {
  const fieldErrors = useFormFieldErrors(id);
  const errorId = `${id}-error`;
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  function syncInputFiles(files: File[]) {
    const input = inputRef.current;
    if (!input) return;

    const transfer = new DataTransfer();
    files.forEach(file => transfer.items.add(file));
    input.files = transfer.files;
  }

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const selected = Array.from(input.files ?? []);

    if (selected.length === 0) return;

    const next = [...photos, ...selected];
    if (next.length > maxPhotos) {
      setError(`You can attach up to ${maxPhotos} photos.`);
      syncInputFiles(photos);
      return;
    }

    const maxSize = maxSizeMb * 1024 * 1024;
    const invalid = selected.find(photo => !photo.type.startsWith("image/") || photo.size === 0 || photo.size > maxSize);

    if (invalid) {
      setError(`Each photo must be an image no larger than ${maxSizeMb} MB.`);
      syncInputFiles(photos);
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const compressed = await Promise.all(selected.map(compressPhoto));
      const updatedPhotos = [...photos, ...compressed];
      setPhotos(updatedPhotos);
      syncInputFiles(updatedPhotos);
    } catch (compressionError) {
      setError(compressionError instanceof Error ? compressionError.message : "Unable to prepare the photos for upload.");
      syncInputFiles(photos);
    } finally {
      setIsProcessing(false);
    }
  }

  function removePhoto(index: number) {
    const remaining = photos.filter((_, i) => i !== index);
    syncInputFiles(remaining);
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
          disabled={disabled || isProcessing}
          onChange={handleChange}
          aria-invalid={fieldErrors.length > 0}
          aria-describedby={fieldErrors.length > 0 ? errorId : undefined}
          className="sr-only"
        />

        {photos.map((photo, index) => {
          const previewUrl = URL.createObjectURL(photo);

          return (
            <div key={`${photo.name}-${index}`} className="flex items-center justify-between gap-3 rounded-md border p-3">
              <div className="flex items-center gap-3 min-w-0">
                <img src={previewUrl} alt={photo.name} className="size-10 rounded object-cover border shrink-0" />
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

        <PrimaryButton
          text={isProcessing ? "Processing photos..." : "Add photos"}
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isProcessing}
        />

        {error && <ErrorAlert text={error} />}
      </div>
    </Input>
  );
}
