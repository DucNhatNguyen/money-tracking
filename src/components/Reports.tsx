"use client";

const CATEGORIES = [
  { color: "#7B6EF6", label: "Ăn uống", amount: "4.430.000đ", pct: 35 },
  { color: "#2DD4BF", label: "Di chuyển", amount: "2.280.000đ", pct: 18 },
  { color: "#FFD93D", label: "Nhà cửa", amount: "3.040.000đ", pct: 24 },
  { color: "#F87171", label: "Khác", amount: "2.900.000đ", pct: 23 },
];

export default function Reports() {
  return (
    <div style={{ background: "#0B0F1E", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ padding: "4px 24px 14px" }}>
        <span style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 800 }}>Báo cáo</span>

        {/* Month navigator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 14,
            padding: "10px 16px",
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 14,
          }}
        >
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#4A5568" strokeWidth="2" strokeLinecap="round">
            <path d="M13 5l-6 5 6 5" />
          </svg>
          <span style={{ color: "#E2E8F0", fontSize: 15, fontWeight: 600 }}>Tháng 5, 2025</span>
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#4A5568" strokeWidth="2" strokeLinecap="round">
            <path d="M7 5l6 5-6 5" />
          </svg>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ padding: "0 24px 16px", display: "flex", gap: 8 }}>
        {[
          { label: "Thu nhập", value: "28.5M", bg: "rgba(45,212,191,.08)", border: "rgba(45,212,191,.14)", textc: "#2D5450", valc: "#2DD4BF" },
          { label: "Chi tiêu", value: "12.65M", bg: "rgba(248,113,113,.08)", border: "rgba(248,113,113,.14)", textc: "#553A3A", valc: "#F87171" },
          { label: "Tiết kiệm", value: "15.85M", bg: "rgba(123,110,246,.08)", border: "rgba(123,110,246,.14)", textc: "#3D3460", valc: "#7B6EF6" },
        ].map((s) => (
          <div key={s.label} style={{ flex: 1, padding: 12, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14 }}>
            <p style={{ color: s.textc, fontSize: 11, marginBottom: 4 }}>{s.label}</p>
            <p style={{ color: s.valc, fontSize: 15, fontWeight: 700 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Donut chart */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0 24px 12px" }}>
        <svg viewBox="0 0 160 160" width="148" height="148">
          <circle cx="80" cy="80" r="55" fill="none" stroke="#141C30" strokeWidth="20" />
          <circle cx="80" cy="80" r="55" fill="none" stroke="#7B6EF6" strokeWidth="20" strokeDasharray="121 225" transform="rotate(-90 80 80)" />
          <circle cx="80" cy="80" r="55" fill="none" stroke="#2DD4BF" strokeWidth="20" strokeDasharray="62 284" strokeDashoffset="-121" transform="rotate(-90 80 80)" />
          <circle cx="80" cy="80" r="55" fill="none" stroke="#FFD93D" strokeWidth="20" strokeDasharray="83 263" strokeDashoffset="-183" transform="rotate(-90 80 80)" />
          <circle cx="80" cy="80" r="55" fill="none" stroke="#F87171" strokeWidth="20" strokeDasharray="80 266" strokeDashoffset="-266" transform="rotate(-90 80 80)" />
          <text x="80" y="76" textAnchor="middle" fill="#E2E8F0" fontSize="15" fontWeight="700" fontFamily="inherit">
            12.65M đ
          </text>
          <text x="80" y="92" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="inherit">
            chi tiêu
          </text>
        </svg>
      </div>

      {/* Category breakdown */}
      <div style={{ flex: 1, padding: "0 24px" }}>
        <p style={{ color: "#64748B", fontSize: 12, fontWeight: 600, letterSpacing: ".05em", marginBottom: 12 }}>
          THEO DANH MỤC
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CATEGORIES.map((cat) => (
            <div key={cat.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#C8D3E0", fontSize: 12, fontWeight: 500 }}>{cat.label}</span>
                  <span style={{ color: "#C8D3E0", fontSize: 12, fontWeight: 600 }}>{cat.amount}</span>
                </div>
                <div style={{ height: 4, background: "#141C30", borderRadius: 2 }}>
                  <div style={{ width: `${cat.pct}%`, height: "100%", background: cat.color, borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
