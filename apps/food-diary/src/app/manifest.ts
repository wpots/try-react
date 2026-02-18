import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Food Diary",
    short_name: "Food Diary",
    description: "Track your food diary entries",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f6f6",
    theme_color: "#8da799",
    icons: [
      {
        src: "/img/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/img/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
