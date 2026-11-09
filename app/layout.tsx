import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { DataProvider } from "@/components/data-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Marketing Report Automator | Bezalel Media",
    template: "%s | Bezalel Media",
  },
  description: "Crafted with Purpose. Turn campaign CSV files into clear marketing performance reports.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#18243A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans">
        <DataProvider>
          <AppShell>{children}</AppShell>
        </DataProvider>
      </body>
    </html>
  );
}
