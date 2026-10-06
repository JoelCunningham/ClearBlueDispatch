import { Button, Section, Text } from "react-email";

import EmailWrapper from "@/content/wrappers/email-wrapper";

interface NewUserEmailProps {
  userName: string;
  loginUrl: string;
  logoUrl: string;
}

export default function NewUserEmail({ userName, loginUrl, logoUrl }: NewUserEmailProps) {
  return (
    <EmailWrapper title="Welcome to ClearBlue Solutions" preview="Set up your account" logoUrl={logoUrl}>
      <Text className="text-foreground text-sm leading-relaxed my-2">Hello {userName},</Text>
      <Text className="text-foreground text-sm leading-relaxed my-2">
        An account has been created for you with ClearBlue Solutions. Before you can sign in, you'll need to set a password for your
        account.
      </Text>

      <Section className="text-center my-6">
        <Button href={loginUrl} className="bg-primary text-white font-semibold text-sm px-6 py-3 rounded-md inline-block no-underline">
          Set Up Your Account
        </Button>
      </Section>

      <Text className="text-xs text-muted italic my-4">This invitation link can only be used once and will expire after 48 hours.</Text>

      <Text className="text-xs text-muted italic my-4">If the button above doesn't work, copy and paste this link into your browser:</Text>

      <Text className="text-xs text-primary break-all my-2">
        <a href={loginUrl} className="text-primary underline">
          {loginUrl}
        </a>
      </Text>
    </EmailWrapper>
  );
}
