import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { StoreProvider } from "@/store/StoreProvider";
import AppLayout from "@/components/AppLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tenant Admin — Property Management",
  description: "Manage your rental flats, tenants, and rent collections with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <StoreProvider>
          <ThemeRegistry>
            <AppLayout>{children}</AppLayout>
          </ThemeRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
