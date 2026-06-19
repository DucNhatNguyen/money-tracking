import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const font = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bvp",
});

export const metadata: Metadata = {
  title: "FinFamily — Thu chi gia đình",
  description: "Ứng dụng theo dõi thu chi gia đình",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={font.variable}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
