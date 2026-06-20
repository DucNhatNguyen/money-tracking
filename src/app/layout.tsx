import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { getSession } from "@/lib/session";

const font = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bvp",
});

export const metadata: Metadata = {
  title: "FinFamily — Thu chi gia đình",
  description: "Ứng dụng theo dõi thu chi gia đình",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const user = session.userId
    ? { name: session.name, username: session.username }
    : null;

  return (
    <html lang="vi" className={font.variable}>
      <body>
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
