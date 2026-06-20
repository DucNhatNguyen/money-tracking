import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FinFamily — Thu chi gia đình",
    short_name: "FinFamily",
    description: "Ứng dụng theo dõi thu chi gia đình",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0F1E",
    theme_color: "#7B6EF6",
    orientation: "portrait",
    icons: [
      {
        src: "/api/pwa-icon?size=192",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/api/pwa-icon?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
