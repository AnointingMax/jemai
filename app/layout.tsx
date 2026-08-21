import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import localFont from "next/font/local";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/lib/cart";
import { SiteHeader } from "@/components/site/site-header";
import { Newsletter } from "@/components/site/newsletter";
import { SiteFooter } from "@/components/site/site-footer";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Classico is the design's display/heading face. It is licensed, so the files
 * are vendored under `public/figma/fonts/Classico` and self-hosted through
 * `next/font/local` — everything downstream reads `--font-classico` /
 * `font-heading`. Only regular (400) and bold (700) are licensed; the 600
 * heading token falls up to the bold file rather than being synthesised.
 */
const classico = localFont({
  variable: "--font-classico",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  src: [
    {
      path: "../public/figma/fonts/Classico/classico-webfont.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/figma/fonts/Classico/classico-bold-webfont.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "JEMAI — Signature style for every square inch",
  description:
    "Considered furniture, contemporary artwork, exhibitions and design services, brought together by a belief that every space should reflect the people within it.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html
    lang="en"
    className={`${assistant.variable} ${classico.variable} h-full antialiased`}
  >
    <body className="bg-surface-page text-text-primary flex min-h-full flex-col">
      <CartProvider>
        <AnnouncementBar />
        <SiteHeader />
        {/* Pages supply their sections as siblings; the 80px editorial gap and
            the closing newsletter are the same on every one of them. */}
        <main className="flex flex-col gap-section-gap-editorial">
          {children}
          <Newsletter />
        </main>
        <SiteFooter />
        <CartDrawer />
      </CartProvider>
    </body>
  </html>
);

export default RootLayout;
