"use client";

import { useState } from "react";

import BaseForm from "@/components/forms/base-form";
import BasicInput from "@/components/inputs/basic-input";
import SelectInput from "@/components/inputs/select-input";
import TextAreaInput from "@/components/inputs/textarea-input";
import { DeliveryContactOption, DeliveryFormInput, DeliveryLocationOption } from "@/features/deliveries/types";
import { ActionResult } from "@/lib/utils/action-utils";
import { getCustomerName } from "@/lib/utils/string-utils";

type UserOption = {
  id: number;
  name: string;
};

type DeliveryFormProps = {
  users: UserOption[];
  locations: DeliveryLocationOption[];
  contacts: DeliveryContactOption[];
  action: (input: DeliveryFormInput) => Promise<ActionResult>;
  date?: string;
  userId?: number;
  locationId?: number;
  contactId?: number;
  tankDetails?: string;
  notes?: string;
};

export default function DeliveryForm({
  users,
  locations,
  contacts,
  action,
  date,
  userId,
  locationId,
  contactId,
  tankDetails,
  notes
}: DeliveryFormProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string>(locationId ? locationId.toString() : "");
  const selectedLocation = locations.find(location => location.id === Number(selectedLocationId));
  const customerContacts = selectedLocation ? contacts.filter(contact => contact.customerId === selectedLocation.customerId) : [];
  const contactPlaceholder = selectedLocation
    ? customerContacts.length > 0
      ? "Select a contact"
      : "No contacts available"
    : "Select a location first";

  async function handleAction(formData: FormData) {
    const contactIdVal = formData.get("contactId");

    const input: DeliveryFormInput = {
      assignedUserId: Number(formData.get("assignedUserId") ?? 0),
      date: String(formData.get("date") ?? ""),
      locationId: Number(formData.get("locationId") ?? 0),
      contactId: contactIdVal ? Number(contactIdVal) : undefined,
      notes: String(formData.get("notes") ?? ""),
      tankDetails: String(formData.get("tankDetails") ?? "")
    };

    return action(input);
  }

  return (
    <BaseForm action={handleAction} errorMessage="Unable to create delivery." submitText={userId ? "Save changes" : "Create delivery"}>
      <BasicInput type="date" id="date" label="Date" initial={date} required />
      <SelectInput
        id="assignedUserId"
        label="Driver"
        items={users.map(user => ({ id: user.id, name: user.name }))}
        placeholder="Select a driver"
        initial={userId?.toString()}
        required
      />
      <SelectInput
        id="locationId"
        label="Location"
        items={locations.map(location => ({ id: location.id, name: getCustomerName(location.customerName, location.address) }))}
        onChange={e => setSelectedLocationId(e.target.value)}
        placeholder="Select a location"
        initial={locationId?.toString()}
        required
      />
      <SelectInput
        id="contactId"
        label="Contact"
        items={customerContacts.map(contact => ({ id: contact.id, name: `${contact.name} — ${contact.phoneNumber}` }))}
        required={customerContacts.length > 0}
        disabled={!selectedLocation || customerContacts.length === 0}
        placeholder={contactPlaceholder}
        initial={contactId?.toString()}
      />
      <TextAreaInput id="tankDetails" label="Tank details" initial={tankDetails} />
      <TextAreaInput id="notes" label="Notes" initial={notes} />
    </BaseForm>
  );
}
