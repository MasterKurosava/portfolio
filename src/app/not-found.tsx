import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// Same options as the locale layout, so both resolve to the same font files.
const geologica = Geologica({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geologica",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Страница не найдена · Page not found",
  robots: { index: false, follow: true },
};

/**
 * Fallback for paths outside the locale segment (an unknown first segment, for example).
 * The root layout only passes children through, so this page brings its own <html>.
 */
export default function RootNotFound() {
  return (
    <html lang="ru" className={geologica.variable}>
      <body>
        <main>
          <section aria-labelledby="not-found-title" className="sheet">
            <p className="key-number m-0 mb-6 text-spot" aria-hidden>
              404
            </p>
            <div className="sheet-head">
              <h1 id="not-found-title" className="sheet-title">
                Страница не найдена
              </h1>
              <p className="sheet-intro">По этому адресу ничего нет. Возможно, в ссылке опечатка.</p>
              <p className="sheet-intro" lang="en">
                Page not found. There is nothing at this address.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/" className="btn btn-primary">
                На главную
              </Link>
              <Link href="/en" className="btn" lang="en" hrefLang="en">
                Home page in English
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
