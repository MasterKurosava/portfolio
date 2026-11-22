import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Every page path, so unprefixed Russian routes such as /cv reach next-intl; files with a dot
  // (PDFs, images) are served from public/ as they are.
  matcher: ["/((?!api|og|_next|_vercel|.*\\..*).*)"],
};
