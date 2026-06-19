"use client";

const RECENT_TRANSACTIONS = [
  { emoji: "🛒", name: "Đi chợ Vinmart", category: "Ăn uống", time: "Hôm nay", amount: "−450.000đ", expense: true },
  { emoji: "💰", name: "Lương tháng 5", category: "Thu nhập", time: "Hôm qua", amount: "+18.000.000đ", expense: false },
  { emoji: "⚡", name: "Tiền điện nước", category: "Nhà cửa", time: "2 ngày trước", amount: "−890.000đ", expense: true },
];

function QuickAction({ emoji, label, color, bg }: { emoji?: string; label: string; color: string; bg: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 18,
          background: bg,
          border: `1px solid ${color}28`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 22 }}>{emoji}</span>
      </div>
      <span style={{ color: "#64748B", fontSize: 11 }}>{label}</span>
    </div>
  );
}

// Mobile Dashboard
function MobileDashboard() {
  return (
    <div style={{ background: "#0B0F1E", minHeight: "100%" }}>
      {/* Header with gradient */}
      <div
        style={{
          background: "linear-gradient(175deg,#170E3F 0%,#0C1835 65%,#0B0F1E 100%)",
          padding: "6px 24px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative radial gradients */}
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -40,
            width: 200,
            height: 200,
            background: "radial-gradient(circle,rgba(123,110,246,.22),transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -20,
            width: 180,
            height: 180,
            background: "radial-gradient(circle,rgba(45,212,191,.1),transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Greeting row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <p style={{ color: "#475569", fontSize: 13, marginBottom: 2 }}>Xin chào 👋</p>
            <p style={{ color: "#E2E8F0", fontSize: 18, fontWeight: 700 }}>Nhà Nguyễn</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.09)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#7B6EF6" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </div>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#7B6EF6,#2DD4BF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              N
            </div>
          </div>
        </div>

        {/* Balance card */}
        <div
          style={{
            background: "rgba(255,255,255,.034)",
            border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 20,
            padding: "18px 20px",
          }}
        >
          <p style={{ color: "#334155", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", marginBottom: 8 }}>
            SỐ DƯ · THÁNG 5/2025
          </p>
          <p style={{ color: "#E2E8F0", fontSize: 30, fontWeight: 800, letterSpacing: "-.5px", marginBottom: 14, lineHeight: 1.1 }}>
            15.850.000{" "}
            <span style={{ fontSize: 16, color: "#64748B", fontWeight: 500 }}>đ</span>
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: "rgba(45,212,191,.07)",
                border: "1px solid rgba(45,212,191,.13)",
                borderRadius: 12,
              }}
            >
              <p style={{ color: "#2D5450", fontSize: 11, marginBottom: 3 }}>↑ Thu nhập</p>
              <p style={{ color: "#2DD4BF", fontSize: 14, fontWeight: 700 }}>28.500.000đ</p>
            </div>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: "rgba(248,113,113,.07)",
                border: "1px solid rgba(248,113,113,.13)",
                borderRadius: 12,
              }}
            >
              <p style={{ color: "#553A3A", fontSize: 11, marginBottom: 3 }}>↓ Chi tiêu</p>
              <p style={{ color: "#F87171", fontSize: 14, fontWeight: 700 }}>12.650.000đ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding: "14px 24px 8px", display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 18,
              background: "linear-gradient(135deg,#7B6EF6,#5A44ED)",
              boxShadow: "0 6px 16px rgba(123,110,246,.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span style={{ color: "#64748B", fontSize: 11 }}>Thêm</span>
        </div>
        <QuickAction emoji="💳" label="Ví" color="#2DD4BF" bg="rgba(45,212,191,.08)" />
        <QuickAction emoji="📊" label="Báo cáo" color="#F87171" bg="rgba(248,113,113,.08)" />
        <QuickAction emoji="⏱" label="Ngân sách" color="#FFD93D" bg="rgba(255,217,61,.08)" />
      </div>

      {/* Recent transactions */}
      <div style={{ flex: 1, padding: "4px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ color: "#C8D3E0", fontSize: 14, fontWeight: 600 }}>Giao dịch gần đây</span>
          <span style={{ color: "#7B6EF6", fontSize: 12, fontWeight: 500 }}>Xem tất cả →</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {RECENT_TRANSACTIONS.map((tx, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: i < RECENT_TRANSACTIONS.length - 1 ? "1px solid rgba(255,255,255,.04)" : undefined,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 13,
                  background: tx.expense ? "rgba(248,113,113,.12)" : "rgba(45,212,191,.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {tx.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#C8D3E0", fontSize: 13, fontWeight: 500, marginBottom: 1 }}>{tx.name}</p>
                <p style={{ color: "#334155", fontSize: 11 }}>
                  {tx.category} · {tx.time}
                </p>
              </div>
              <span style={{ color: tx.expense ? "#F87171" : "#2DD4BF", fontSize: 13, fontWeight: 600 }}>
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Desktop Dashboard
function DesktopDashboard() {
  return (
    <div style={{ flex: 1, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14, overflow: "auto" }}>
      {/* Greeting */}
      <div>
        <h2 style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 800, marginBottom: 2 }}>
          Xin chào, Nhà Nguyễn! 👋
        </h2>
        <p style={{ color: "#3D4B60", fontSize: 12 }}>Thứ Năm, 19 tháng 6, 2025 · Tháng 5/2025</p>
      </div>

      {/* KPI row */}
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        {[
          { label: "↑ Thu nhập", value: "28.500.000đ", note: "+5.2% so tháng trước", color: "#2DD4BF", notecol: "#2D5450" },
          { label: "↓ Chi tiêu", value: "12.650.000đ", note: "−3.1% so tháng trước", color: "#F87171", notecol: "#553A3A" },
          { label: "💰 Tiết kiệm", value: "15.850.000đ", note: "Tỉ lệ 55.6%", color: "#7B6EF6", notecol: "#3D3460" },
          { label: "⏱ Ngân sách", value: "79%", note: "12.65M / 16M · Còn 3.35M", color: "#FFD93D", notecol: "#3A3620" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              flex: 1,
              padding: 16,
              background: "#141C30",
              borderRadius: 14,
              borderTop: `2px solid ${kpi.color}`,
            }}
          >
            <p style={{ color: "#2D3B55", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{kpi.label}</p>
            <p style={{ color: kpi.color, fontSize: 20, fontWeight: 800 }}>{kpi.value}</p>
            <p style={{ color: kpi.notecol, fontSize: 11, marginTop: 4 }}>{kpi.note}</p>
          </div>
        ))}
      </div>

      {/* Line chart */}
      <div style={{ flex: 1, background: "#141C30", borderRadius: 16, padding: 18, overflow: "hidden", minHeight: 200 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ color: "#C8D3E0", fontSize: 14, fontWeight: 700 }}>Xu hướng thu chi 6 tháng</h3>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 2, background: "#2DD4BF", borderRadius: 1 }} />
              <span style={{ color: "#64748B", fontSize: 11 }}>Thu nhập</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 2, background: "#F87171", borderRadius: 1 }} />
              <span style={{ color: "#64748B", fontSize: 11 }}>Chi tiêu</span>
            </div>
          </div>
        </div>
        <svg viewBox="0 0 820 160" width="100%" height="140" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2DD4BF" stopOpacity=".18" />
              <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F87171" stopOpacity=".14" />
              <stop offset="100%" stopColor="#F87171" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="20" x2="820" y2="20" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
          <line x1="0" y1="60" x2="820" y2="60" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
          <line x1="0" y1="100" x2="820" y2="100" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
          <line x1="0" y1="140" x2="820" y2="140" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
          <text x="0" y="18" fill="#2D3B55" fontSize="9" fontFamily="inherit">35M</text>
          <text x="0" y="58" fill="#2D3B55" fontSize="9" fontFamily="inherit">25M</text>
          <text x="0" y="98" fill="#2D3B55" fontSize="9" fontFamily="inherit">15M</text>
          <text x="0" y="138" fill="#2D3B55" fontSize="9" fontFamily="inherit">5M</text>
          <polygon points="40,51 204,60 368,47 532,42 696,47 800,40 800,140 40,140" fill="url(#incomeGrad)" />
          <polyline points="40,51 204,60 368,47 532,42 696,47 800,40" fill="none" stroke="#2DD4BF" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          <polygon points="40,111 204,97 368,104 532,107 696,90 800,100 800,140 40,140" fill="url(#expenseGrad)" />
          <polyline points="40,111 204,97 368,104 532,107 696,90 800,100" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {[40, 204, 368, 532, 696].map((x, i) => (
            <circle key={x} cx={x} cy={[51, 60, 47, 42, 47][i]} r="4" fill="#2DD4BF" />
          ))}
          <circle cx="800" cy="40" r="5" fill="#2DD4BF" stroke="#141C30" strokeWidth="2" />
          {[40, 204, 368, 532, 696].map((x, i) => (
            <circle key={x} cx={x} cy={[111, 97, 104, 107, 90][i]} r="4" fill="#F87171" />
          ))}
          <circle cx="800" cy="100" r="5" fill="#F87171" stroke="#141C30" strokeWidth="2" />
          {["T12", "T1", "T2", "T3", "T4"].map((label, i) => (
            <text key={label} x={[40, 204, 368, 532, 696][i]} y="158" fill="#2D3B55" fontSize="10" textAnchor="middle" fontFamily="inherit">
              {label}
            </text>
          ))}
          <text x="800" y="158" fill="#7B6EF6" fontSize="10" textAnchor="middle" fontFamily="inherit" fontWeight="700">
            T5
          </text>
        </svg>
      </div>

      {/* Today's transactions */}
      <div style={{ flexShrink: 0, background: "#141C30", borderRadius: 14, padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ color: "#C8D3E0", fontSize: 13, fontWeight: 700 }}>Giao dịch hôm nay</span>
          <span style={{ color: "#7B6EF6", fontSize: 12, fontWeight: 500 }}>Xem tất cả →</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { emoji: "🛒", name: "Đi chợ Vinmart", cat: "Ăn uống · 08:30", amount: "−450.000đ", expense: true },
            { emoji: "🍜", name: "Ăn sáng phở", cat: "Ăn uống · 07:15", amount: "−75.000đ", expense: true },
            { emoji: "🎮", name: "Game online", cat: "Giải trí · 21:00", amount: "−450.000đ", expense: true },
          ].map((tx) => (
            <div
              key={tx.name}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 10,
                background: "#0D1322",
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "rgba(248,113,113,.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  flexShrink: 0,
                }}
              >
                {tx.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#C8D3E0", fontSize: 12, fontWeight: 500, marginBottom: 1 }}>{tx.name}</p>
                <p style={{ color: "#2D3B55", fontSize: 11 }}>{tx.cat}</p>
              </div>
              <span style={{ color: "#F87171", fontSize: 12, fontWeight: 600 }}>{tx.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <>
      <div className="lg:hidden">
        <MobileDashboard />
      </div>
      <div className="hidden lg:block h-full">
        <DesktopDashboard />
      </div>
    </>
  );
}
