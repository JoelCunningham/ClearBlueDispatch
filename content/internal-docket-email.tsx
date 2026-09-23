import { dateToShortFormat } from "@/lib/utils/date-utils";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset
} from "react-email";

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
  return (
    <Html>
      <Head />
      <Preview>
        {isUpdate ? `[INTERNAL UPDATED]` : `[INTERNAL]`} Docket ${number} -${customerName}
      </Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                primary: "#2c4b9b",
                secondary: "#b7e4f7",
                foreground: "#0a0a0a",
                background: "#ffffff",
                muted: "#737373",
                border: "#eaeaea",
                card: "#fafafa"
              }
            }
          }
        }}
      >
        <Body className="bg-card font-sans my-auto mx-auto p-4">
          <Container className="bg-background border border-solid border-border rounded-lg max-w-140 mx-auto p-8 my-10">
            <Section className="border-b-2 border-solid border-primary pb-4 mb-6">
              <Row>
                <Column align="left">
                  <Heading className="text-primary text-xl font-bold p-0 m-0">ClearBlue Solutions</Heading>
                  <Text className="inline-block bg-secondary text-primary px-2.5 py-1 rounded text-xs font-semibold mt-2 mb-0">
                    {isUpdate ? "Updated Internal Docket Record" : "Internal Docket Notification"}
                  </Text>
                </Column>

                <Column align="right" className="w-25">
                  <Img src={logoUrl} width="80" height="50" alt="ClearBlue Solutions Logo" className="block my-0 ml-auto" />
                </Column>
              </Row>
            </Section>

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
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
