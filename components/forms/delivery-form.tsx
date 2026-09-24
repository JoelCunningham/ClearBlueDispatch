"use client";

import { useState } from "react";

import BasicInput from "@/components/inputs/basic-input";
import SelectInput from "@/components/inputs/select-input";
import TextAreaInput from "@/components/inputs/textarea-input";
import Form from "@/components/wrappers/form";
import { DeliveryContactOption, DeliveryFormInput, DeliveryLocationOption } from "@/features/deliveries/types";
import { suppressEvent } from "@/lib/utils/event-utils";
import { getCustomerName } from "@/lib/utils/string-utils";
import { inputFormatToDate } from "@/lib/utils/date-utils";

type UserOption = {
  id: number;
  name: string;
};

type DeliveryFormProps = {
  users: UserOption[];
  locations: DeliveryLocationOption[];
  contacts: DeliveryContactOption[];
  action: (input: DeliveryFormInput) => Promise<{ success: boolean; error?: string }>;
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
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const selectedLocation = locations.find(location => location.id === Number(selectedLocationId));
  const customerContacts = selectedLocation ? contacts.filter(contact => contact.customerId === selectedLocation.customerId) : [];
  const contactPlaceholder = selectedLocation
    ? customerContacts.length > 0
      ? "Select a contact"
      : "No contacts available"
    : "Select a location first";

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    suppressEvent(event);
    setError(undefined);
    setIsSaving(true);

    try {
      const formData = new FormData(event.currentTarget);
      const contactIdVal = formData.get("contactId");

      const input: DeliveryFormInput = {
        assignedUserId: Number(formData.get("assignedUserId") ?? 0),
        date: String(formData.get("date") ?? ""),
        locationId: Number(formData.get("locationId") ?? 0),
        contactId: contactIdVal ? Number(contactIdVal) : undefined,
        notes: String(formData.get("notes") ?? ""),
        tankDetails: String(formData.get("tankDetails") ?? "")
      };

      const result = await action(input);
      if (!result.success) setError(result.error ?? "Unable to create delivery.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create delivery.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} isSaving={isSaving} error={error} submitText={userId ? "Save changes" : "Create delivery"}>
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
    </Form>
  );
}
