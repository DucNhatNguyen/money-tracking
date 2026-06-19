"use client";

const BUDGET_ITEMS = [
  { emoji: "🍜", label: "Ăn uống", spent: 4430000, total: 6000000, color: "#2DD4BF", pct: 74 },
  { emoji: "🚗", label: "Di chuyển", spent: 1280000, total: 2000000, color: "#7B6EF6", pct: 64 },
  { emoji: "🎮", label: "Giải trí", spent: 1800000, total: 1500000, color: "#F87171", pct: 120, over: true },
  { emoji: "🛍️", label: "Mua sắm", spent: 820000, total: 3000000, color: "#FFD93D", pct: 27 },
];

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function Budget() {
  return (
    <div style={{ background: "#0B0F1E", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "4px 24px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 800 }}>Ngân sách</span>
          <div
            style={{
              padding: "6px 12px",
              background: "linear-gradient(135deg,rgba(123,110,246,.15),rgba(45,212,191,.1))",
              border: "1px solid rgba(123,110,246,.2)",
              borderRadius: 10,
            }}
          >
            <span style={{ color: "#7B6EF6", fontSize: 12, fontWeight: 600 }}>+ Thêm mục</span>
          </div>
        </div>

        {/* Overall bar */}
        <div
          style={{
            padding: 16,
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#94A3B8", fontSize: 12 }}>Tổng chi tiêu tháng 5</span>
            <span style={{ color: "#E2E8F0", fontSize: 12, fontWeight: 600 }}>12.65M / 16M đ</span>
          </div>
          <div style={{ height: 6, background: "#141C30", borderRadius: 3 }}>
            <div
              style={{
                width: "79%",
                height: "100%",
                background: "linear-gradient(90deg,#7B6EF6,#2DD4BF)",
                borderRadius: 3,
              }}
            />
          </div>
          <p style={{ color: "#2DD4BF", fontSize: 12, marginTop: 6 }}>Còn 3.35M đ có thể chi</p>
        </div>
      </div>

      {/* Budget items */}
      <div style={{ flex: 1, padding: "0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        {BUDGET_ITEMS.map((item) => (
          <div
            key={item.label}
            style={{
              padding: 16,
              background: item.over ? "rgba(248,113,113,.06)" : "rgba(255,255,255,.04)",
              border: `1px solid ${item.over ? "rgba(248,113,113,.22)" : "rgba(255,255,255,.07)"}`,
              borderRadius: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: item.over ? 6 : 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{item.emoji}</span>
                <div>
                  <p style={{ color: "#C8D3E0", fontSize: 13, fontWeight: 600 }}>{item.label}</p>
                  <p style={{ color: item.over ? "#F87171" : "#334155", fontSize: 11 }}>
                    {formatVND(item.spent)} / {formatVND(item.total)}
                  </p>
                </div>
              </div>
              {item.over ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <span style={{ color: "#F87171", fontSize: 13, fontWeight: 700 }}>{item.pct}%</span>
                  <span style={{ color: "#F87171", fontSize: 10 }}>Vượt 300K</span>
                </div>
              ) : (
                <span style={{ color: item.color, fontSize: 13, fontWeight: 700 }}>{item.pct}%</span>
              )}
            </div>

            <div style={{ height: 5, background: item.over ? "rgba(248,113,113,.15)" : "#141C30", borderRadius: 3 }}>
              <div
                style={{
                  width: `${Math.min(item.pct, 100)}%`,
                  height: "100%",
                  background: item.color,
                  borderRadius: 3,
                }}
              />
            </div>

            {item.over && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  padding: "6px 10px",
                  background: "rgba(248,113,113,.1)",
                  borderRadius: 8,
                }}
              >
                <svg viewBox="0 0 16 16" width="12" height="12" fill="#F87171">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                <span style={{ color: "#F87171", fontSize: 11 }}>Đã vượt ngân sách tháng này!</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
