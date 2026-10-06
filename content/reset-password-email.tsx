import { Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Tailwind, Text, pixelBasedPreset } from "react-email";
import EmailWrapper from "./wrappers/email-wrapper";

interface ResetPasswordEmailProps {
  userName: string;
  loginUrl: string;
  logoUrl: string;
}

export default function ResetPasswordEmail({ userName, loginUrl, logoUrl }: ResetPasswordEmailProps) {
  var title = "Reset Your Password";
  var previewText = "Your reset link is ready";

  return (
    <EmailWrapper title={title} preview={previewText} logoUrl={logoUrl}>
      <Text className="text-foreground text-sm leading-relaxed my-2">Hello {userName},</Text>
      <Text className="text-foreground text-sm leading-relaxed my-2">
        You have requested to reset your password for your ClearBlue Solutions account.
      </Text>

      <Section className="text-center my-6">
        <Button href={loginUrl} className="bg-primary text-white font-semibold text-sm px-6 py-3 rounded-md inline-block no-underline">
          Reset Your Password
        </Button>
      </Section>

      <Text className="text-xs text-muted italic my-4">This reset link can only be used once and will expire after 48 hours.</Text>

      <Text className="text-xs text-muted italic my-4">If the button above doesn't work, copy and paste this link into your browser:</Text>

      <Text className="text-xs text-primary break-all my-2">
        <a href={loginUrl} className="text-primary underline">
          {loginUrl}
        </a>
      </Text>
    </EmailWrapper>
  );
}
