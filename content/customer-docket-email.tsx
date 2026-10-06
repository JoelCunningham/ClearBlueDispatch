import { Hr, Section, Text } from "react-email";

import EmailWrapper from "@/content/wrappers/email-wrapper";
import { configs } from "@/lib/config/configs";
import { dateToShortFormat } from "@/lib/utils/date-utils";

interface CustomerDocketEmailProps {
  number: string;
  customerName: string;
  date: Temporal.Instant;
  volume: number | string;
  batchNumber: string;
  logoUrl: string;
  isUpdate: boolean;
}

export default function CustomerDocketEmail({
  number,
  customerName,
  date,
  volume,
  batchNumber,
  isUpdate,
  logoUrl
}: CustomerDocketEmailProps) {
  var title = `Delivery Docket ${number}`;
  var previewText = isUpdate ? "Your delivery docket has been updated" : "Your delivery docket is ready";

  return (
    <EmailWrapper title={title} preview={previewText} logoUrl={logoUrl}>
      <Text className="text-foreground text-sm leading-relaxed my-2">
        Hello <strong>{customerName}</strong>,
      </Text>
      <Text className="text-foreground text-sm leading-relaxed my-2">
        {isUpdate
          ? `Please find updated delivery details for Docket ${number}.`
          : `Your delivery has been completed. Please find your official delivery docket attached as a PDF.`}
      </Text>

      <Section className="bg-card border-l-4 border-solid border-primary p-4 my-6 rounded-r-md">
        <Text className="text-sm text-foreground my-1">
          <strong className="text-muted">Date:</strong> {dateToShortFormat(date)}
        </Text>
        <Text className="text-sm text-foreground my-1">
          <strong className="text-muted">Volume Delivered:</strong> {volume} L
        </Text>
        <Text className="text-sm text-foreground my-1">
          <strong className="text-muted">Batch Number:</strong> {batchNumber}
        </Text>
      </Section>

      <Text className="text-xs text-muted italic my-4">
        A PDF copy containing full delivery site details, driver signature, and certification numbers is attached to this email.
      </Text>

      <Hr className="border-border my-6" />

      <Text className="text-xs text-muted mt-1 mb-0">
        This email was sent automatically. Please do not reply to this email. For any inquiries, contact office support at&nbsp;
        <a href={`tel:${configs.contact.office.phone}`} className="text-primary underline">
          {configs.contact.office.phone}
        </a>
        .
      </Text>
    </EmailWrapper>
  );
}
