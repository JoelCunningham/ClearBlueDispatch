import { Hr, Section, Text } from "react-email";

import EmailWrapper from "@/content/wrappers/email-wrapper";
import { dateToShortFormat } from "@/lib/utils/date-utils";

interface InternalDocketEmailProps {
  number: string;
  customerName: string;
  address: string;
  date: Temporal.Instant;
  volume: number | string;
  batchNumber: string;
  repName: string;
  logoUrl: string;
  isUpdate: boolean;
}

export default function InternalDocketEmail({
  number,
  customerName,
  address,
  date,
  volume,
  batchNumber,
  repName,
  isUpdate,
  logoUrl
}: InternalDocketEmailProps) {
  var title = isUpdate ? "Docket Update Notification" : "New Docket Notification";
  var previewText = isUpdate ? "A docket has been updated" : "A new docket has been created";

  return (
    <EmailWrapper title={title} preview={previewText} logoUrl={logoUrl}>
      <Text className="text-foreground text-sm leading-relaxed my-2">Hello,</Text>
      <Text className="text-foreground text-sm leading-relaxed my-2">
        {isUpdate
          ? `Docket ${number} has been updated. Below are the complete docket details for your records.`
          : `A new delivery docket (${number}) has been created. Details are summarized below.`}
      </Text>

      <Section className="bg-card border-l-4 border-solid border-primary p-4 my-6 rounded-r-md">
        <Text className="text-sm text-foreground my-1">
          <strong className="text-muted">Docket Number:</strong> {number}
        </Text>
        <Text className="text-sm text-foreground my-1">
          <strong className="text-muted">Customer Name:</strong> {customerName}
        </Text>
        <Text className="text-sm text-foreground my-1">
          <strong className="text-muted">Delivery Address:</strong> {address}
        </Text>
        <Text className="text-sm text-foreground my-1">
          <strong className="text-muted">Delivery Date:</strong> {dateToShortFormat(date)}
        </Text>
        <Text className="text-sm text-foreground my-1">
          <strong className="text-muted">Volume Delivered:</strong> {volume} L
        </Text>
        <Text className="text-sm text-foreground my-1">
          <strong className="text-muted">Batch Number:</strong> #{batchNumber}
        </Text>
        <Text className="text-sm text-foreground my-1">
          <strong className="text-muted">Recipient:</strong> {repName}
        </Text>
      </Section>

      <Text className="text-xs text-muted italic my-4">
        The full docket PDF (including customer signature, site details, and certification info) is attached to this email.
      </Text>

      <Hr className="border-border my-6" />

      <Text className="text-xs text-muted mt-1 mb-0">This is an internal system notification for management.</Text>
    </EmailWrapper>
  );
}
