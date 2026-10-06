import { Body, Container, Head, Heading, Html, Img, Preview, Section, Tailwind, Text, pixelBasedPreset } from "react-email";

interface EmailWrapperProps {
  title: string;
  preview: string;
  logoUrl: string;
  children?: React.ReactNode;
}

export default function EmailWrapper({ title, preview, logoUrl, children }: EmailWrapperProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>

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
                          {title}
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
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
