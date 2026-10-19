"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ErrorAlert from "@/components/alerts/error-alert";
import PrimaryButton from "@/components/buttons/primary-button";
import { useFormFieldErrors } from "@/components/forms/base-form";
import Input from "@/components/wrappers/input";

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

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      photos.forEach(photo => URL.revokeObjectURL(URL.createObjectURL(photo)));
    };
  }, [photos]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const selected = Array.from(input.files ?? []);

    if (selected.length === 0) return;

    const next = [...photos, ...selected];
    if (next.length > maxPhotos) {
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

        <PrimaryButton text="Add photos" onClick={() => inputRef.current?.click()} />

        {error && <ErrorAlert text={error} />}
      </div>
    </Input>
  );
}
