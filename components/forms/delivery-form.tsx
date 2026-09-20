"use client";

import { useState } from "react";

import SubmitButton from "@/components/buttons/submit-button";
import DateInput from "@/components/inputs/date-input";
import SelectInput from "@/components/inputs/select-input";
import TextAreaInput from "@/components/inputs/textarea-input";
import { DeliveryContactOption, DeliveryLocationOption } from "@/features/deliveries/types";
import { getFullName } from "@/lib/utils/customer-util";

type UserOption = {
  id: number;
  name: string;
};

type DeliveryFormProps = {
  users: UserOption[];
  locations: DeliveryLocationOption[];
  contacts: DeliveryContactOption[];
  action: (formData: FormData) => void | Promise<void>;
};

export function DeliveryForm({ users, locations, contacts, action }: DeliveryFormProps) {
  const [selectedLocationId, setSelectedLocationId] = useState("");

  const selectedLocation = locations.find(location => location.id === Number(selectedLocationId));
  const customerContacts = selectedLocation ? contacts.filter(contact => contact.customerId === selectedLocation.customerId) : [];
  const contactPlaceholder = selectedLocation
    ? customerContacts.length > 0
      ? "Select a contact"
      : "No contacts available"
    : "Select a location first";

  return (
    <form action={action} className="space-y-3">
      <DateInput id="date" label="Date" />
      <SelectInput
        id="assignedUserId"
        label="Driver"
        items={users.map(user => ({ id: user.id, name: user.name }))}
        placeholder="Select a driver"
      />
      <SelectInput
        id="locationId"
        label="Location"
        items={locations.map(location => ({ id: location.id, name: getFullName(location.customerName, location.address) }))}
        onChange={setSelectedLocationId}
        placeholder="Select a location"
      />
      <SelectInput
        id="contactId"
        label="Contact"
        items={customerContacts.map(contact => ({ id: contact.id, name: `${contact.name} — ${contact.phoneNumber}` }))}
        required={customerContacts.length > 0}
        disabled={!selectedLocation}
        placeholder={contactPlaceholder}
      />
      <TextAreaInput id="tankDetails" label="Tank details" />
      <TextAreaInput id="notes" label="Notes" />

      <SubmitButton text="Create delivery" />
    </form>
  );
}
