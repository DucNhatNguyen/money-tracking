"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import HelpGuide from "@/components/HelpGuide";

interface User {
  name: string;
  username: string;
}

const NAV = [
  {
    href: "/",
    label: "Tổng quan",
    icon: (active: boolean) => (
      <svg viewBox="0 0 20 20" width="20" height="20" fill={active ? "#7B6EF6" : "none"} stroke={active ? "#7B6EF6" : "#3D4B60"} strokeWidth="1.5">
        <path d="M10 3L3 9.5V17a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1V9.5L10 3z" />
      </svg>
    ),
  },
  {
    href: "/transactions",
    label: "Giao dịch",
    icon: (active: boolean) => (
      <svg viewBox="0 0 20 20" width="20" height="20" fill={active ? "#7B6EF6" : "none"} stroke={active ? "#7B6EF6" : "#3D4B60"} strokeWidth="1.5">
        <path d="M7 4H5a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-2M7 4a1 1 0 011-1h4a1 1 0 011 1v1H7z" />
        <path d="M7 9h6M7 12h4" stroke={active ? "#7B6EF6" : "#3D4B60"} />
      </svg>
    ),
  },
  null, // center FAB
  {
    href: "/reports",
    label: "Báo cáo",
    icon: (active: boolean) => (
      <svg viewBox="0 0 20 20" width="20" height="20" fill={active ? "#7B6EF6" : "none"} stroke={active ? "#7B6EF6" : "#3D4B60"} strokeWidth="1.5">
        <path d="M16 16V8M10 16V4M4 16v-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/budget",
    label: "Ngân sách",
    icon: (active: boolean) => (
      <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke={active ? "#7B6EF6" : "#3D4B60"} strokeWidth="1.5">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v4l2.5 2.5" />
      </svg>
    ),
  },
];

function getActiveFlex(pathname: string): number {
  if (pathname === "/") return 0;
  if (pathname.startsWith("/transactions")) return 1;
  if (pathname.startsWith("/reports")) return 3;
  if (pathname.startsWith("/budget")) return 4;
  return -1;
}

function BottomNav({ pathname }: { pathname: string }) {
  const af = getActiveFlex(pathname);
  const mult = (2 * (af >= 0 ? af : 0) + 1) / 10;
  const lineLeft = `calc((100% - 38px) * ${mult} - 2px)`;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: "#0D1322",
        borderRadius: "20px 20px 0 0",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.45), 0 -1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          height: 3,
          width: 42,
          borderRadius: "0 0 4px 4px",
          background: "linear-gradient(90deg,#7B6EF6,#2DD4BF)",
          left: lineLeft,
          opacity: af >= 0 ? 1 : 0,
          transition: "left 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease",
          pointerEvents: "none",
        }}
      />

      <div style={{ height: 62, display: "flex", alignItems: "flex-end", padding: "0 12px", position: "relative" }}>
        {NAV.map((item) => {
          if (!item) {
            return (
              <div
                key="fab"
                style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center" }}
              >
                <Link href="/add" style={{ display: "block", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#7B6EF6,#2DD4BF)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "4px solid #0B0F1E",
                      marginTop: -18,
                      boxShadow: "0 4px 18px rgba(123,110,246,.6), 0 2px 8px rgba(0,0,0,.3)",
                      marginBottom: 20,
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </Link>
              </div>
            );
          }

          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                paddingBottom: 10,
                textDecoration: "none",
                WebkitTapHighlightColor: "transparent",
              } as React.CSSProperties}
            >
              <div
                style={{
                  lineHeight: 0,
                  transform: active ? "scale(1.15)" : "scale(1)",
                  transition: "transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                {item.icon(active)}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#7B6EF6" : "#4A5568",
                  letterSpacing: "0.24px",
                  lineHeight: 1,
                  transition: "color 0.2s ease",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="pb-safe" />
    </nav>
  );
}

function SidebarNav({ pathname, user }: { pathname: string; user: User | null }) {
  const initial = user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <aside
      style={{
        width: 232,
        background: "#0D1322",
        borderRight: "1px solid rgba(255,255,255,.04)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
      className="hidden lg:flex"
    >
      <div className="flex-1 px-3 py-5 flex flex-col gap-[2px]">
        {NAV.filter(Boolean).map((item) => {
          const i = item!;
          const active = i.href === "/" ? pathname === "/" : pathname.startsWith(i.href);
          return (
            <Link
              key={i.href}
              href={i.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                background: active ? "rgba(123,110,246,.1)" : "transparent",
                textDecoration: "none",
              }}
            >
              {i.icon(active)}
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#7B6EF6" : "#3D4B60" }}>
                {i.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,.04)" }}>
        <div
          style={{
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 14,
            padding: 14,
          }}
        >
          <p style={{ color: "#2D3B55", fontSize: 10, fontWeight: 600, letterSpacing: ".06em", marginBottom: 6 }}>
            SỐ DƯ THÁNG NÀY
          </p>
          <p style={{ color: "#E2E8F0", fontSize: 22, fontWeight: 800, letterSpacing: "-.3px" }}>
            — <span style={{ fontSize: 12, color: "#64748B" }}>đ</span>
          </p>
        </div>

        <Link href="/add">
          <div
            style={{
              marginTop: 10,
              padding: "11px 14px",
              background: "linear-gradient(135deg,rgba(123,110,246,.15),rgba(45,212,191,.1))",
              border: "1px solid rgba(123,110,246,.2)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#7B6EF6" strokeWidth="1.8">
              <circle cx="10" cy="10" r="8" />
              <line x1="10" y1="6" x2="10" y2="14" />
              <line x1="6" y1="10" x2="14" y2="10" />
            </svg>
            <span style={{ color: "#7B6EF6", fontSize: 13, fontWeight: 600 }}>Thêm giao dịch</span>
          </div>
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              marginTop: 8,
              width: "100%",
              padding: "10px 14px",
              background: "rgba(248,113,113,.06)",
              border: "1px solid rgba(248,113,113,.12)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#F87171" strokeWidth="1.6" strokeLinecap="round">
              <path d="M7 3H4a1 1 0 00-1 1v12a1 1 0 001 1h3" />
              <path d="M13 14l3-4-3-4M16 10H8" />
            </svg>
            <span style={{ color: "#F87171", fontSize: 13, fontWeight: 600 }}>Đăng xuất</span>
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, padding: "6px 4px" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#7B6EF6,#2DD4BF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 12,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div>
            <p style={{ color: "#C8D3E0", fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>{user?.name ?? "—"}</p>
            <p style={{ color: "#3D4B60", fontSize: 11 }}>{user?.username ?? ""}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ user }: { user: User | null }) {
  const initial = user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <header
      style={{
        height: 62,
        background: "#0D1322",
        borderBottom: "1px solid rgba(255,255,255,.05)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexShrink: 0,
      }}
      className="hidden lg:flex"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, width: 232, flexShrink: 0 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: "linear-gradient(135deg,#7B6EF6,#2DD4BF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>F</span>
        </div>
        <span style={{ color: "#E2E8F0", fontSize: 16, fontWeight: 800 }}>FinFamily</span>
      </div>

      <div
        style={{
          flex: 1,
          padding: "8px 14px",
          background: "rgba(255,255,255,.04)",
          border: "1px solid rgba(255,255,255,.07)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#3D4B60" strokeWidth="1.5">
          <circle cx="9" cy="9" r="6" />
          <path d="M15 15l-3-3" />
        </svg>
        <span style={{ color: "#3D4B60", fontSize: 13 }}>Tìm kiếm giao dịch, danh mục...</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 12px",
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 10,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#7B6EF6,#2DD4BF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            {initial}
          </div>
          <span style={{ color: "#C8D3E0", fontSize: 13, fontWeight: 500 }}>{user?.name ?? "—"}</span>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            title="Đăng xuất"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "rgba(248,113,113,.07)",
              border: "1px solid rgba(248,113,113,.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#F87171" strokeWidth="1.6" strokeLinecap="round">
              <path d="M7 3H4a1 1 0 00-1 1v12a1 1 0 001 1h3" />
              <path d="M13 14l3-4-3-4M16 10H8" />
            </svg>
          </button>
        </form>
      </div>
    </header>
  );
}

export default function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") return <>{children}</>;

  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden flex flex-col min-h-dvh" style={{ background: "#0B0F1E" }}>
        <main
          className="flex-1"
          style={{
            paddingTop: "env(safe-area-inset-top, 0px)",
            paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))",
          }}
        >
          {children}
        </main>
        <BottomNav pathname={pathname} />
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex flex-col h-screen">
        <Topbar user={user} />
        <div className="flex flex-1 overflow-hidden">
          <SidebarNav pathname={pathname} user={user} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>

      <HelpGuide />
    </>
  );
}
