import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { getSession } from "@/lib/session";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const font = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bvp",
});

export const viewport: Viewport = {
  themeColor: "#7B6EF6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "FinFamily — Thu chi gia đình",
  description: "Ứng dụng theo dõi thu chi gia đình",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FinFamily",
  },
  // Next.js 16 generates "mobile-web-app-capable" (Android) instead of
  // "apple-mobile-web-app-capable" (iOS) — add it explicitly via other
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
  icons: {
    icon: "/api/pwa-icon?size=32",
    apple: [
      { url: "/api/pwa-icon?size=180", sizes: "180x180", type: "image/png" },
    ],
  },
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
        <ServiceWorkerRegistration />
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
