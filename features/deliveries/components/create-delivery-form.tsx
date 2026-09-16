"use client";

import { useState } from "react";

import { DeliveryContactOption, DeliveryLocationOption } from "@/features/deliveries/types";

type UserOption = {
  id: number;
  name: string;
};

type CreateDeliveryFormProps = {
  users: UserOption[];
  locations: DeliveryLocationOption[];
  contacts: DeliveryContactOption[];
  action: (formData: FormData) => void | Promise<void>;
};

export function CreateDeliveryForm({ users, locations, contacts, action }: CreateDeliveryFormProps) {
  const [selectedLocationId, setSelectedLocationId] = useState("");

  const selectedLocation = locations.find(location => location.id === Number(selectedLocationId));

  const customerContacts = selectedLocation
    ? contacts.filter(contact => contact.customerId === selectedLocation.customerId)
    : [];

  const defaultContactId = customerContacts.length > 0 ? String(customerContacts[0].id) : "";

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="date" className="text-sm font-medium">
          Date
        </label>

        <input
          id="date"
          name="date"
          type="date"
          required
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="assignedUserId" className="text-sm font-medium">
          Driver
        </label>

        <select
          id="assignedUserId"
          name="assignedUserId"
          required
          className="w-full rounded-md border bg-background px-3 py-2"
        >
          <option value="">Select a driver</option>

          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="locationId" className="text-sm font-medium">
          Location
        </label>

        <select
          id="locationId"
          name="locationId"
          required
          value={selectedLocationId}
          onChange={event => setSelectedLocationId(event.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2"
        >
          <option value="">Select a location</option>

          {locations.map(location => (
            <option key={location.id} value={location.id}>
              {location.customerName} ({location.suburb})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="contactId" className="text-sm font-medium">
          Contact
        </label>

        <select
          id="contactId"
          name="contactId"
          required={customerContacts.length > 0}
          disabled={!selectedLocation}
          defaultValue={defaultContactId}
          className="w-full rounded-md border bg-background px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {!selectedLocation ? (
            <option value="">Select a location first</option>
          ) : customerContacts.length === 0 ? (
            <option value="">No contacts available</option>
          ) : (
            customerContacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.name} — {contact.phoneNumber}
              </option>
            ))
          )}
        </select>

        {!selectedLocation && <p className="text-xs text-muted-foreground">Select a location to choose a contact.</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="tankDetails" className="text-sm font-medium">
          Tank details
        </label>

        <textarea
          id="tankDetails"
          name="tankDetails"
          rows={4}
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>

        <textarea id="notes" name="notes" rows={4} className="w-full rounded-md border bg-background px-3 py-2" />
      </div>

      <button type="submit" className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground">
        Create delivery
      </button>
    </form>
  );
}
