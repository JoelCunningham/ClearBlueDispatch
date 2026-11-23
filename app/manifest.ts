import type { MetadataRoute } from "next";

const isPreview = process.env.VERCEL_ENV === "preview";

const nameSuffix = isPreview ? "(Preview)" : "";
const iconPrefix = isPreview ? "/icons/preview" : "/icons";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/routes",
    name: `Clear Blue Dispatch ${nameSuffix}`,
    short_name: `ClearBlue ${nameSuffix}`,
    description: "Delivery and docket management for Clear Blue Solutions",
    start_url: "/routes",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2c4b9c",
    icons: [
      {
        src: `${iconPrefix}/logo-192.png`,
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: `${iconPrefix}/logo-512.png`,
        sizes: "512x512",
        type: "image/png"
      }
    ],
    screenshots: [
      {
        src: "/screenshots/routes-mobile.png",
        sizes: "390x844",
        type: "image/png"
      },
      {
        src: "/screenshots/routes-desktop.png",
        sizes: "1440x900",
        type: "image/png",
        form_factor: "wide"
      }
    ]
  };
}
