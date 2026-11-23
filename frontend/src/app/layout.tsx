import type { Metadata } from "next";
import { Outfit, Source_Sans_3 } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "OnNests",
    template: "%s · OnNests",
  },
  description:
    "OnNests — multi-tenant property operations platform with organization-scoped data isolation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-[family-name:var(--font-sans)] text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
