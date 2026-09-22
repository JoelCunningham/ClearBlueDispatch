import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "@react-pdf/tailwind";

import { configs } from "@/lib/config/configs";

interface DocketPdfProps {
  number: string;
  date: string;
  customerName: string;
  address: string;
  volume: number | string;
  batchNumber: string;
  comments?: string;
  repName: string;
  signature: string;
  logo: Buffer | string;
}

export default function DocketPdf({
  number,
  date,
  customerName,
  address,
  volume,
  batchNumber,
  comments,
  repName,
  signature,
  logo
}: DocketPdfProps) {
  const tw = createTw({
    colors: {
      primary: "#2c4b9b",
      secondary: "#b7e4f7",
      foreground: "#0a0a0a",
      background: "#ffffff",
      muted: "#737373",
      border: "#eaeaea",
      card: "#fafafa"
    }
  });
  return (
    <Document>
      <Page size={[420, 595]} style={tw("p-6 text-xs font-sans text-foreground bg-background")}>
        <View style={tw("flex-row justify-between items-start pb-2")}>
          <View style={tw("flex-col")}>
            <Text style={tw("text-2xl font-bold text-primary -mb-3")}>ClearBlue Solutions</Text>
            <View style={tw("flex-row items-center")}>
              <View style={tw("bg-primary px-3 py-1 rounded-sm mr-2")}>
                <Text style={tw("text-background font-bold text-xs px-2 py-0.5")}>AdBlue®</Text>
              </View>
              <View style={tw("flex-col")}>
                <Text style={tw("text-xs text-muted")}>VDA Certification #{configs.certifications.vda}</Text>
                <Text style={tw("text-xs text-muted")}>NMI Certification #{configs.certifications.nmi}</Text>
              </View>
            </View>
          </View>
          <View style={tw("items-end")}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={logo} style={tw("w-16 h-14")} />
          </View>
        </View>

        <View style={tw("border-b border-border my-2")} />

        <View style={tw("flex-row justify-between items-center my-1.5")}>
          <View style={tw("flex-row border border-border h-6 items-center")}>
            <Text style={tw("w-12 pl-2 font-bold text-muted")}>Date</Text>
            <View style={tw("px-3 border-l border-border h-full justify-center")}>
              <Text>{date}</Text>
            </View>
          </View>

          <View style={tw("flex-row items-baseline")}>
            <Text style={tw("font-bold text-muted text-xs mr-1.5 pb-1")}>Docket Number</Text>
            <Text style={tw("font-bold text-primary text-sm")}>{number}</Text>
          </View>
        </View>

        <View style={tw("bg-secondary py-1 px-2 mt-1.5")}>
          <Text style={tw("font-bold text-sm text-primary pt-1")}>DELIVERY DOCKET</Text>
        </View>

        <View style={tw("border border-border mt-1")}>
          <View style={tw("flex-row border-b border-border min-h-6 items-center")}>
            <View style={tw("w-28 pl-2 font-bold text-muted border-r border-border h-full justify-center")}>
              <Text>Customer name</Text>
            </View>
            <Text style={tw("flex-1 pl-3 pr-1.5 text-foreground")}>{customerName}</Text>
          </View>

          <View style={tw("flex-row border-b border-border min-h-6 items-center")}>
            <View style={tw("w-28 pl-2 font-bold text-muted border-r border-border h-full justify-center")}>
              <Text>Delivery address</Text>
            </View>
            <Text style={tw("flex-1 pl-3 pr-1.5 text-foreground")}>{address}</Text>
          </View>

          <View style={tw("flex-row border-b border-border min-h-6 items-center")}>
            <View style={tw("w-28 pl-2 font-bold text-muted border-r border-border h-full justify-center")}>
              <Text>Delivery volume</Text>
            </View>
            <Text style={tw("flex-1 pl-3 pr-1.5 text-foreground")}>{`${volume} L`}</Text>
          </View>

          <View style={tw("flex-row border-b border-border min-h-6 items-center")}>
            <View style={tw("w-28 pl-2 font-bold text-muted border-r border-border h-full justify-center")}>
              <Text>Batch number</Text>
            </View>
            <Text style={tw("flex-1 pl-3 pr-1.5 text-foreground")}>{`#${batchNumber}`}</Text>
          </View>

          <View style={tw("flex-row min-h-12 items-start pt-1.5")}>
            <View style={tw("w-28 pl-2 font-bold text-muted border-r border-border min-h-10")}>
              <Text>Comments</Text>
            </View>
            <Text style={tw("flex-1 pl-3 pr-1.5 text-foreground")}>{comments || ""}</Text>
          </View>
        </View>

        <View style={tw("flex-row border border-t-0 border-border h-12")}>
          <View style={tw("flex-1 p-1.5 justify-between border-r border-border")}>
            <Text style={tw("font-bold text-muted text-xs")}>Name</Text>
            <Text style={tw("text-xs text-foreground")}>{repName}</Text>
          </View>

          <View style={tw("flex-1 p-1.5 justify-between")}>
            <Text style={tw("font-bold text-muted text-xs")}>Signature</Text>
            <Text style={tw("text-xs text-foreground")}>{signature}</Text>
          </View>
        </View>

        <View style={tw("flex-row justify-between mt-5")}>
          <View style={tw("flex-col")}>
            <Text style={tw("font-bold text-primary text-sm")}>CONTACTS</Text>
            <Text style={tw("text-muted font-bold mt-1")}>Managing Director</Text>
            <Text style={tw("font-bold mt-1")}>
              {configs.contact.director.name?.toUpperCase()} {configs.contact.director.phone}
            </Text>
            <Text style={tw("mt-1")}>{configs.contact.director.email}</Text>

            <Text style={tw("font-bold mt-2")}>OFFICE {configs.contact.office.phone}</Text>
            <Text style={tw("mt-1")}>{configs.contact.office.email}</Text>
          </View>

          <View style={tw("flex-col items-end")}>
            <Text style={tw("text-muted text-xs")}>NMI = National Measurement Institute</Text>
            <Text style={tw("text-muted text-xs mt-2")}>AdBlue® is a registered trademark of</Text>
            <Text style={tw("text-muted text-xs")}>Verband der Automobilindustrie e.V (VDA).</Text>
            <Text style={tw("mt-7")}>ABN {configs.contact.abn}</Text>
            <Text style={tw("font-bold text-primary mt-1 underline")}>{configs.contact.website}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
