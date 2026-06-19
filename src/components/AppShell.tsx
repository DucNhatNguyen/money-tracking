"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/",
    label: "Tổng quan",
    icon: (active: boolean) => (
      <svg viewBox="0 0 20 20" width="20" height="20" fill={active ? "#7B6EF6" : "none"} stroke={active ? "#7B6EF6" : "#2D3B55"} strokeWidth="1.5">
        <path d="M10 3L3 9.5V17a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1V9.5L10 3z" />
      </svg>
    ),
  },
  {
    href: "/transactions",
    label: "Giao dịch",
    icon: (active: boolean) => (
      <svg viewBox="0 0 20 20" width="20" height="20" fill={active ? "#7B6EF6" : "none"} stroke={active ? "#7B6EF6" : "#2D3B55"} strokeWidth="1.5">
        <path d="M7 4H5a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-2M7 4a1 1 0 011-1h4a1 1 0 011 1v1H7z" />
        <path d="M7 9h6M7 12h4" stroke={active ? "#7B6EF6" : "#2D3B55"} />
      </svg>
    ),
  },
  null, // center FAB
  {
    href: "/reports",
    label: "Báo cáo",
    icon: (active: boolean) => (
      <svg viewBox="0 0 20 20" width="20" height="20" fill={active ? "#7B6EF6" : "none"} stroke={active ? "#7B6EF6" : "#2D3B55"} strokeWidth="1.5">
        <path d="M16 16V8M10 16V4M4 16v-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/budget",
    label: "Ngân sách",
    icon: (active: boolean) => (
      <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke={active ? "#7B6EF6" : "#2D3B55"} strokeWidth="1.5">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v4l2.5 2.5" />
      </svg>
    ),
  },
];

function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav
      style={{
        background: "#0C1221",
        borderTop: "1px solid rgba(255,255,255,.05)",
      }}
      className="fixed bottom-0 left-0 right-0 flex items-stretch pb-safe z-40"
    >
      {NAV.map((item, i) => {
        if (!item) {
          return (
            <div key="fab" className="flex-1 flex flex-col items-center justify-start pt-[2px]">
              <Link href="/add">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    background: "linear-gradient(135deg,#7B6EF6,#2DD4BF)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: -14,
                    boxShadow: "0 6px 18px rgba(123,110,246,.45)",
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
          <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center gap-[3px] py-[10px]">
            {active && (
              <div
                style={{
                  padding: "5px 9px",
                  borderRadius: 9,
                  background: "rgba(123,110,246,.16)",
                  lineHeight: 0,
                }}
              >
                {item.icon(true)}
              </div>
            )}
            {!active && item.icon(false)}
            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 600 : 400,
                color: active ? "#7B6EF6" : "#2D3B55",
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarNav({ pathname }: { pathname: string }) {
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

      {/* Balance widget */}
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
            SỐ DƯ THÁNG 5
          </p>
          <p style={{ color: "#E2E8F0", fontSize: 22, fontWeight: 800, letterSpacing: "-.3px" }}>
            15.85M <span style={{ fontSize: 12, color: "#64748B" }}>đ</span>
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <div style={{ flex: 1, paddingTop: 6, borderTop: "2px solid #2DD4BF" }}>
              <p style={{ color: "#2D5450", fontSize: 10, marginBottom: 2 }}>↑ Thu</p>
              <p style={{ color: "#2DD4BF", fontSize: 12, fontWeight: 700 }}>28.5M</p>
            </div>
            <div style={{ flex: 1, paddingTop: 6, borderTop: "2px solid #F87171" }}>
              <p style={{ color: "#553A3A", fontSize: 10, marginBottom: 2 }}>↓ Chi</p>
              <p style={{ color: "#F87171", fontSize: 12, fontWeight: 700 }}>12.65M</p>
            </div>
          </div>
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
      </div>
    </aside>
  );
}

function Topbar() {
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
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#7B6EF6" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#F87171",
              border: "1.5px solid #0D1322",
            }}
          />
        </div>
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
            N
          </div>
          <span style={{ color: "#C8D3E0", fontSize: 13, fontWeight: 500 }}>Nhà Nguyễn</span>
        </div>
      </div>
    </header>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden flex flex-col min-h-dvh">
        <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 82 }}>
          {children}
        </main>
        <BottomNav pathname={pathname} />
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex flex-col h-screen">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <SidebarNav pathname={pathname} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </>
  );
}
