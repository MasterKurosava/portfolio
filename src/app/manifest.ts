import type { MetadataRoute } from "next";

/** For "add to home screen": the name and the "MK" icon on the stage colour. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Михаил Калачёв · Fullstack-разработчик",
    short_name: "Калачёв",
    start_url: "/",
    display: "browser",
    background_color: "#121110",
    theme_color: "#121110",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
