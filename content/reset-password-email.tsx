import { Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Tailwind, Text, pixelBasedPreset } from "react-email";

interface ResetPasswordEmailProps {
  userName: string;
  loginUrl: string;
  logoUrl: string;
}

export default function ResetPasswordEmail({ userName, loginUrl, logoUrl }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>ClearBlue Solutions - Reset your password</Preview>

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
              <Container className="w-full">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td align="left">
                        <Heading className="text-primary text-xl font-bold p-0 m-0">ClearBlue Solutions</Heading>
                        <Text className="inline-block bg-secondary text-primary px-2.5 py-1 rounded text-xs font-semibold mt-2 mb-0">
                          Reset Password
                        </Text>
                      </td>
                      <td align="right" className="w-25">
                        <Img src={logoUrl} width="80" height="50" alt="ClearBlue Solutions Logo" className="block my-0 ml-auto" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Container>
            </Section>

            <Text className="text-foreground text-sm leading-relaxed my-2">Hello {userName},</Text>
            <Text className="text-foreground text-sm leading-relaxed my-2">
              You have requested to reset your password for your ClearBlue Solutions account.
            </Text>

            <Section className="text-center my-6">
              <Button
                href={loginUrl}
                className="bg-primary text-white font-semibold text-sm px-6 py-3 rounded-md inline-block no-underline"
              >
                Reset Your Password
              </Button>
            </Section>

            <Text className="text-xs text-muted italic my-4">This reset link can only be used once and will expire after 48 hours.</Text>

            <Text className="text-xs text-muted italic my-4">
              If the button above doesn't work, copy and paste this link into your browser:
            </Text>

            <Text className="text-xs text-primary break-all my-2">
              <a href={loginUrl} className="text-primary underline">
                {loginUrl}
              </a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
