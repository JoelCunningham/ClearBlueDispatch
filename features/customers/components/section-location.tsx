"use client";

import type { Dispatch, SetStateAction } from "react";

import type { LocationFormItem } from "../types";
import { Plus, Trash } from "lucide-react";

type LocationSectionProps = {
  locations: LocationFormItem[];
  setLocations: Dispatch<SetStateAction<LocationFormItem[]>>;
};

export function LocationSection({ locations, setLocations }: LocationSectionProps) {
  function addLocation() {
    setLocations(current => [...current, { address: "" }]);
  }
  function removeLocation(index: number) {
    setLocations(current => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function updateLocation(index: number, address: string) {
    setLocations(current =>
      current.map((location, currentIndex) => (currentIndex === index ? { ...location, address } : location))
    );
  }

  return (
    <section className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Locations</h2>
          <p className="text-sm text-muted-foreground">Add locations for deliveries.</p>
        </div>

        <button
          type="button"
          onClick={addLocation}
          className="shrink-0 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <Plus />
        </button>
      </div>

      {locations.length === 0 ? (
        <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">No locations added.</div>
      ) : (
        <div className="space-y-3">
          {locations.map((location, index) => (
            <div key={location.id ?? `new-${index}`} className="flex gap-2">
              <input
                type="text"
                value={location.address}
                onChange={event => updateLocation(index, event.target.value)}
                disabled={location.id !== undefined}
                placeholder="Address"
                className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 disabled:bg-muted"
              />

              <button
                type="button"
                onClick={() => removeLocation(index)}
                title="Remove location"
                className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
              >
                <Trash />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
