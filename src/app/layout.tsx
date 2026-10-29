import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { StoreProvider } from "@/store/StoreProvider";
import AppLayout from "@/components/AppLayout";
import { SnackbarProvider } from "@/components/SnackbarProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nivaasa (निवास) — Harmonious Property Management",
  description:
    "Smart, peaceful property management. Frictionless tenant onboarding, Aadhaar e-KYC, multi-mode rent collection, and AI maintenance tracking.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f4f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1117" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StoreProvider>
          <ThemeRegistry>
            <SnackbarProvider>
              <AppLayout>{children}</AppLayout>
            </SnackbarProvider>
          </ThemeRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
