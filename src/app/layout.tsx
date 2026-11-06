import type { Metadata, Viewport } from "next";
import { Manrope, Outfit } from "next/font/google";
import Script from "next/script";
import { AppShell } from "@/components/layout/AppShell";
import { themeBootScript, ThemeProvider } from "@/context/ThemeContext";
import { DatabaseProvider } from "@/hooks/useLocalDb";
import { PwaProvider } from "@/hooks/usePwaInstall";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: "MochiMoy — Kawaii Pastel Luxe Finance",
  description: "Catat cuan, celengan impian, dan dompet pastel. Semua data tersimpan di perangkatmu.",
  applicationName: "MochiMoy",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "MochiMoy",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: "/icons/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#B8A7E0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${outfit.variable} ${manrope.variable}`}>
      <body className="font-manrope antialiased" suppressHydrationWarning>
        <Script id="mochi-theme-boot" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
        <ThemeProvider>
          <PwaProvider>
            <DatabaseProvider>
              <AppShell>{children}</AppShell>
            </DatabaseProvider>
          </PwaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
