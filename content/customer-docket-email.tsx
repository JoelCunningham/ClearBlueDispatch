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
  return (
    <Html>
      <Head />
      <Preview>{isUpdate ? `Updated Docket ${number}` : `Delivery Docket ${number}`} - ClearBlue Solutions</Preview>
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
                    Delivery Docket {number}
                  </Text>
                </Column>

                <Column align="right" className="w-25">
                  <Img src={logoUrl} width="80" height="50" alt="ClearBlue Solutions Logo" className="block my-0 ml-auto" />
                </Column>
              </Row>
            </Section>

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
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
