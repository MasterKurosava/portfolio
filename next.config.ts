import type { NextConfig } from "next";
import { resolve } from "node:path";
import createNextIntlPlugin from "next-intl/plugin";
import { withDiorama } from "@dioramajs/diorama/next";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  // A separate folder lets a production build run beside the dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  // Diorama 0.1.1 aliases the effect registry for webpack under its old package name
  // (`diorama/generated`), so production builds got an empty registry. Alias the current name.
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@dioramajs/diorama/generated$": resolve(process.cwd(), "src/diorama.gen.ts"),
    };
    return config;
  },
};

export default withDiorama(withNextIntl(nextConfig));
