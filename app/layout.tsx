import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin"],
  display: "swap",
});

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

/**
 * Only the document shell and the shared type live here. The storefront and the
 * admin tree each supply their own chrome and their own metadata.
 */
export const metadata: Metadata = {
  title: "JEMAI",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html
    lang="en"
    className={`${assistant.variable} ${classico.variable} h-full antialiased`}
  >
    <body className="bg-surface-page text-text-primary flex min-h-full flex-col">
      {children}
    </body>
  </html>
);

export default RootLayout;
