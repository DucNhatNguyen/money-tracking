"use client";
import Link from "next/link";

interface RecentTx {
  id: string;
  note: string | null;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: Date;
  category: { name: string; emoji: string; color: string };
}

interface DashboardProps {
  userName: string;
  income: number;
  expense: number;
  balance: number;
  month: number;
  year: number;
  recentTransactions: RecentTx[];
}

function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function fmtShort(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toLocaleString("vi-VN");
}

function timeAgo(date: Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "Hôm qua";
  return `${diffDays} ngày trước`;
}

function QuickAction({ emoji, label, color, bg }: { emoji: string; label: string; color: string; bg: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ width: 52, height: 52, borderRadius: 18, background: bg, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 22 }}>{emoji}</span>
      </div>
      <span style={{ color: "#64748B", fontSize: 11 }}>{label}</span>
    </div>
  );
}

function MobileDashboard({ userName, income, expense, balance, month, year, recentTransactions }: DashboardProps) {
  const initial = userName?.[0]?.toUpperCase() ?? "?";
  return (
    <div style={{ background: "#0B0F1E", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(175deg,#170E3F 0%,#0C1835 65%,#0B0F1E 100%)", marginTop: "calc(-1 * env(safe-area-inset-top, 0px))", padding: "calc(env(safe-area-inset-top, 0px) + 14px) 24px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -40, width: 200, height: 200, background: "radial-gradient(circle,rgba(123,110,246,.22),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -20, width: 180, height: 180, background: "radial-gradient(circle,rgba(45,212,191,.1),transparent 70%)", pointerEvents: "none" }} />

        {/* Greeting */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <p style={{ color: "#475569", fontSize: 13, marginBottom: 2 }}>Xin chào 👋</p>
            <p style={{ color: "#E2E8F0", fontSize: 18, fontWeight: 700 }}>{userName}</p>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#7B6EF6,#2DD4BF)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15, fontWeight: 800 }}>
            {initial}
          </div>
        </div>

        {/* Balance card */}
        <div style={{ background: "rgba(255,255,255,.034)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, padding: "18px 20px" }}>
          <p style={{ color: "#334155", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", marginBottom: 8 }}>
            SỐ DƯ · THÁNG {month}/{year}
          </p>
          <p style={{ color: "#E2E8F0", fontSize: 30, fontWeight: 800, letterSpacing: "-.5px", marginBottom: 14, lineHeight: 1.1 }}>
            {fmtShort(balance)} <span style={{ fontSize: 16, color: "#64748B", fontWeight: 500 }}>đ</span>
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, padding: "10px 12px", background: "rgba(45,212,191,.07)", border: "1px solid rgba(45,212,191,.13)", borderRadius: 12 }}>
              <p style={{ color: "#2D5450", fontSize: 11, marginBottom: 3 }}>↑ Thu nhập</p>
              <p style={{ color: "#2DD4BF", fontSize: 14, fontWeight: 700 }}>{fmtShort(income)}đ</p>
            </div>
            <div style={{ flex: 1, padding: "10px 12px", background: "rgba(248,113,113,.07)", border: "1px solid rgba(248,113,113,.13)", borderRadius: 12 }}>
              <p style={{ color: "#553A3A", fontSize: 11, marginBottom: 3 }}>↓ Chi tiêu</p>
              <p style={{ color: "#F87171", fontSize: 14, fontWeight: 700 }}>{fmtShort(expense)}đ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding: "14px 24px 8px", display: "flex", justifyContent: "space-between" }}>
        <Link href="/add" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textDecoration: "none" }}>
          <div style={{ width: 52, height: 52, borderRadius: 18, background: "linear-gradient(135deg,#7B6EF6,#5A44ED)", boxShadow: "0 6px 16px rgba(123,110,246,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span style={{ color: "#64748B", fontSize: 11 }}>Thêm</span>
        </Link>
        <QuickAction emoji="💳" label="Ví" color="#2DD4BF" bg="rgba(45,212,191,.08)" />
        <QuickAction emoji="📊" label="Báo cáo" color="#F87171" bg="rgba(248,113,113,.08)" />
        <QuickAction emoji="⏱" label="Ngân sách" color="#FFD93D" bg="rgba(255,217,61,.08)" />
      </div>

      {/* Recent transactions */}
      <div style={{ flex: 1, padding: "4px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ color: "#C8D3E0", fontSize: 14, fontWeight: 600 }}>Giao dịch gần đây</span>
          <Link href="/transactions" style={{ color: "#7B6EF6", fontSize: 12, fontWeight: 500, textDecoration: "none" }}>Xem tất cả →</Link>
        </div>
        {recentTransactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#334155", fontSize: 13 }}>
            Chưa có giao dịch nào. <Link href="/add" style={{ color: "#7B6EF6", textDecoration: "none", fontWeight: 600 }}>Thêm ngay →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {recentTransactions.map((tx, i) => (
              <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < recentTransactions.length - 1 ? "1px solid rgba(255,255,255,.04)" : undefined }}>
                <div style={{ width: 40, height: 40, borderRadius: 13, background: tx.type === "EXPENSE" ? "rgba(248,113,113,.12)" : "rgba(45,212,191,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {tx.category.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#C8D3E0", fontSize: 13, fontWeight: 500, marginBottom: 1 }}>{tx.note || tx.category.name}</p>
                  <p style={{ color: "#334155", fontSize: 11 }}>{tx.category.name} · {timeAgo(tx.date)}</p>
                </div>
                <span style={{ color: tx.type === "EXPENSE" ? "#F87171" : "#2DD4BF", fontSize: 13, fontWeight: 600 }}>
                  {tx.type === "EXPENSE" ? "−" : "+"}{fmt(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DesktopDashboard({ userName, income, expense, balance, month, year, recentTransactions }: DashboardProps) {
  const MONTHS = ["", "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const savingRate = income > 0 ? ((balance / income) * 100).toFixed(1) : "0";

  return (
    <div style={{ flex: 1, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14, overflow: "auto" }}>
      <div>
        <h2 style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 800, marginBottom: 2 }}>Xin chào, {userName}! 👋</h2>
        <p style={{ color: "#3D4B60", fontSize: 12 }}>{MONTHS[month]} {year}</p>
      </div>

      {/* KPI row */}
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        {[
          { label: "↑ Thu nhập", value: fmtShort(income) + "đ", note: `${MONTHS[month]}/${year}`, color: "#2DD4BF", notecol: "#2D5450" },
          { label: "↓ Chi tiêu", value: fmtShort(expense) + "đ", note: `${MONTHS[month]}/${year}`, color: "#F87171", notecol: "#553A3A" },
          { label: "💰 Tiết kiệm", value: fmtShort(balance) + "đ", note: `Tỉ lệ ${savingRate}%`, color: "#7B6EF6", notecol: "#3D3460" },
          { label: "📊 Giao dịch", value: String(recentTransactions.length), note: "5 gần nhất hiển thị", color: "#FFD93D", notecol: "#3A3620" },
        ].map((kpi) => (
          <div key={kpi.label} style={{ flex: 1, padding: 16, background: "#141C30", borderRadius: 14, borderTop: `2px solid ${kpi.color}` }}>
            <p style={{ color: "#2D3B55", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{kpi.label}</p>
            <p style={{ color: kpi.color, fontSize: 20, fontWeight: 800 }}>{kpi.value}</p>
            <p style={{ color: kpi.notecol, fontSize: 11, marginTop: 4 }}>{kpi.note}</p>
          </div>
        ))}
      </div>

      {/* Chart (static decorative) */}
      <div style={{ flex: 1, background: "#141C30", borderRadius: 16, padding: 18, overflow: "hidden", minHeight: 200 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ color: "#C8D3E0", fontSize: 14, fontWeight: 700 }}>Xu hướng thu chi</h3>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 20, height: 2, background: "#2DD4BF", borderRadius: 1 }} /><span style={{ color: "#64748B", fontSize: 11 }}>Thu nhập</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 20, height: 2, background: "#F87171", borderRadius: 1 }} /><span style={{ color: "#64748B", fontSize: 11 }}>Chi tiêu</span></div>
          </div>
        </div>
        <svg viewBox="0 0 820 160" width="100%" height="140" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2DD4BF" stopOpacity=".18" /><stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" /></linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F87171" stopOpacity=".14" /><stop offset="100%" stopColor="#F87171" stopOpacity="0" /></linearGradient>
          </defs>
          {[20, 60, 100, 140].map((y) => <line key={y} x1="0" y1={y} x2="820" y2={y} stroke="rgba(255,255,255,.04)" strokeWidth="1" />)}
          <polygon points="40,51 204,60 368,47 532,42 696,47 800,40 800,140 40,140" fill="url(#incomeGrad)" />
          <polyline points="40,51 204,60 368,47 532,42 696,47 800,40" fill="none" stroke="#2DD4BF" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          <polygon points="40,111 204,97 368,104 532,107 696,90 800,100 800,140 40,140" fill="url(#expenseGrad)" />
          <polyline points="40,111 204,97 368,104 532,107 696,90 800,100" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="800" cy="40" r="5" fill="#2DD4BF" stroke="#141C30" strokeWidth="2" />
          <circle cx="800" cy="100" r="5" fill="#F87171" stroke="#141C30" strokeWidth="2" />
        </svg>
      </div>

      {/* Recent */}
      <div style={{ flexShrink: 0, background: "#141C30", borderRadius: 14, padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ color: "#C8D3E0", fontSize: 13, fontWeight: 700 }}>Giao dịch gần đây</span>
          <Link href="/transactions" style={{ color: "#7B6EF6", fontSize: 12, fontWeight: 500, textDecoration: "none" }}>Xem tất cả →</Link>
        </div>
        {recentTransactions.length === 0 ? (
          <p style={{ color: "#334155", fontSize: 13, textAlign: "center", padding: "16px 0" }}>
            Chưa có giao dịch. <Link href="/add" style={{ color: "#7B6EF6", textDecoration: "none" }}>Thêm ngay →</Link>
          </p>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            {recentTransactions.slice(0, 3).map((tx) => (
              <div key={tx.id} style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: 10, background: "#0D1322", borderRadius: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: tx.type === "EXPENSE" ? "rgba(248,113,113,.1)" : "rgba(45,212,191,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
                  {tx.category.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#C8D3E0", fontSize: 12, fontWeight: 500, marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.note || tx.category.name}</p>
                  <p style={{ color: "#2D3B55", fontSize: 11 }}>{tx.category.name}</p>
                </div>
                <span style={{ color: tx.type === "EXPENSE" ? "#F87171" : "#2DD4BF", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                  {tx.type === "EXPENSE" ? "−" : "+"}{fmtShort(tx.amount)}đ
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard(props: DashboardProps) {
  return (
    <>
      <div className="lg:hidden"><MobileDashboard {...props} /></div>
      <div className="hidden lg:block h-full"><DesktopDashboard {...props} /></div>
    </>
  );
}
