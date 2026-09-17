import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ReviewTayo — Philippine Civil Service Exam Reviewer",
    short_name: "ReviewTayo",
    description:
      "Comprehensive, 100% original Philippine Civil Service Examination (CSE-PPT) reviewer and offline practice platform.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#FAF8F7",
    theme_color: "#86152D",
    categories: ["education", "productivity", "utilities"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
