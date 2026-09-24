import { Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Tailwind, Text, pixelBasedPreset } from "react-email";

interface NewUserEmailProps {
  userName: string;
  userEmail: string;
  userPassword: string;
  loginUrl: string;
  logoUrl: string;
}

export default function NewUserEmail({ userName, userEmail, userPassword, loginUrl, logoUrl }: NewUserEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to ClearBlue Solutions - Your login credentials inside</Preview>
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
                          Account Activated
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
              Welcome aboard! Your account has been provisioned and is ready to use. Below are your initial login credentials.
            </Text>

            <Section className="bg-card border-l-4 border-solid border-primary p-4 my-6 rounded-r-md">
              <Heading as="h3" className="text-sm font-bold text-primary m-0 mb-3">
                Your Login Details
              </Heading>
              <Text className="text-sm text-foreground my-1">
                <strong className="text-muted">Username / Email:</strong> {userEmail}
              </Text>
              <Text className="text-sm text-foreground my-1">
                <strong className="text-muted">Temporary Password:</strong>
                <code className="bg-border text-foreground px-2 py-0.5 rounded font-mono text-xs">{userPassword}</code>
              </Text>
            </Section>

            <Text className="text-xs text-muted italic my-3">
              * For security reasons, you will be required to change this temporary password upon your first sign-in.
            </Text>

            <Section className="text-center my-6">
              <Button
                href={loginUrl}
                className="bg-primary text-white font-semibold text-sm px-6 py-3 rounded-md inline-block no-underline"
              >
                Log In &amp; Change Password
              </Button>
            </Section>

            <Text className="text-xs text-muted italic my-4">
              If the button above doesn’t work, copy and paste this link into your browser:
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
