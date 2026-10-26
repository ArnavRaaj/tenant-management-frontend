import type { Metadata } from "next";
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
  title: "Tenant Admin — Property Management",
  description:
    "Manage your rental flats, tenants, and rent collections with ease.",
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
