"use client";
import { useState } from "react";

const ALL_MONTHS = ["Tháng 5", "Tháng 4", "Tháng 3"];

const TRANSACTIONS_BY_DATE = [
  {
    label: "HÔM NAY — 16/05",
    date: "16/05/2025",
    items: [
      { emoji: "🛒", name: "Đi chợ Vinmart", sub: "Ăn uống · 08:30", amount: "−450.000đ", expense: true },
      { emoji: "🍜", name: "Ăn sáng phở", sub: "Ăn uống · 07:15", amount: "−75.000đ", expense: true },
    ],
  },
  {
    label: "HÔM QUA — 15/05",
    date: "15/05/2025",
    items: [
      { emoji: "💰", name: "Lương tháng 5", sub: "Thu nhập · 09:00", amount: "+18.000.000đ", expense: false },
      { emoji: "⚡", name: "Tiền điện nước", sub: "Nhà cửa · 14:20", amount: "−890.000đ", expense: true },
      { emoji: "📚", name: "Học phí lớp toán", sub: "Giáo dục · 10:00", amount: "−2.500.000đ", expense: true },
    ],
  },
];

const ALL_TRANSACTIONS = [
  { emoji: "🛒", name: "Đi chợ Vinmart", category: "Ăn uống", date: "16/05/2025", time: "08:30", amount: "−450.000đ", expense: true },
  { emoji: "🍜", name: "Ăn sáng phở", category: "Ăn uống", date: "16/05/2025", time: "07:15", amount: "−75.000đ", expense: true },
  { emoji: "💰", name: "Lương tháng 5", category: "Thu nhập", date: "15/05/2025", time: "09:00", amount: "+18.000.000đ", expense: false },
  { emoji: "⚡", name: "Tiền điện nước", category: "Nhà cửa", date: "15/05/2025", time: "14:20", amount: "−890.000đ", expense: true },
  { emoji: "📚", name: "Học phí lớp toán", category: "Giáo dục", date: "15/05/2025", time: "10:00", amount: "−2.500.000đ", expense: true },
  { emoji: "🎮", name: "Game online 3 tháng", category: "Giải trí", date: "14/05/2025", time: "21:00", amount: "−450.000đ", expense: true },
  { emoji: "🚗", name: "Xăng xe máy", category: "Di chuyển", date: "13/05/2025", time: "17:30", amount: "−150.000đ", expense: true },
];

// Mobile Transactions
function MobileTransactions() {
  const [activeMonth, setActiveMonth] = useState("Tháng 5");

  return (
    <div style={{ background: "#0B0F1E", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ padding: "4px 24px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 800 }}>Giao dịch</span>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </div>
        </div>
        {/* Month tabs */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          {ALL_MONTHS.map((month) => (
            <button
              key={month}
              onClick={() => setActiveMonth(month)}
              style={{
                flexShrink: 0,
                padding: "7px 18px",
                background: activeMonth === month ? "linear-gradient(135deg,#7B6EF6,#2DD4BF)" : "rgba(255,255,255,.05)",
                border: activeMonth === month ? "none" : "1px solid rgba(255,255,255,.07)",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  color: activeMonth === month ? "#fff" : "#4A5568",
                  fontSize: 13,
                  fontWeight: activeMonth === month ? 600 : 400,
                }}
              >
                {month}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction groups */}
      <div style={{ padding: "0 24px" }}>
        {TRANSACTIONS_BY_DATE.map((group) => (
          <div key={group.label} style={{ marginBottom: 16 }}>
            <div
              style={{
                color: "#2D3B55",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {group.label}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {group.items.map((tx, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: i < group.items.length - 1 ? "1px solid rgba(255,255,255,.04)" : undefined,
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
                    <p style={{ color: "#334155", fontSize: 11 }}>{tx.sub}</p>
                  </div>
                  <span style={{ color: tx.expense ? "#F87171" : "#2DD4BF", fontSize: 13, fontWeight: 600 }}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Desktop Transactions with right panel
function DesktopTransactions() {
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Main */}
      <div style={{ flex: 1, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 0, overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 800, marginBottom: 2 }}>Giao dịch</h2>
            <p style={{ color: "#3D4B60", fontSize: 12 }}>Tháng 5/2025 · 24 giao dịch</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              style={{
                padding: "7px 14px",
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.07)",
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="#64748B" strokeWidth="1.5">
                <path d="M3 5h14M6 10h8M9 15h2" />
              </svg>
              <span style={{ color: "#64748B", fontSize: 12 }}>Lọc</span>
            </div>
            <div
              style={{
                padding: "7px 16px",
                background: "linear-gradient(135deg,#7B6EF6,#2DD4BF)",
                borderRadius: 9,
                cursor: "pointer",
              }}
            >
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>+ Thêm mới</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexShrink: 0 }}>
          {[
            { label: "Thu nhập", value: "+28.500.000đ", color: "#2DD4BF" },
            { label: "Chi tiêu", value: "−12.650.000đ", color: "#F87171" },
            { label: "Tiết kiệm", value: "+15.850.000đ", color: "#7B6EF6" },
            { label: "Số giao dịch", value: "24", color: "#E2E8F0" },
          ].map((stat) => (
            <div key={stat.label} style={{ flex: 1, padding: "12px 14px", background: "#141C30", borderRadius: 12 }}>
              <p style={{ color: "#2D3B55", fontSize: 10, marginBottom: 3 }}>{stat.label}</p>
              <p style={{ color: stat.color, fontSize: 16, fontWeight: 800 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 14px 8px",
            borderBottom: "1px solid rgba(255,255,255,.05)",
            flexShrink: 0,
          }}
        >
          {["Giao dịch", "Danh mục", "Ngày", "Số tiền"].map((col, i) => (
            <span
              key={col}
              style={{
                flex: i === 0 ? 2 : 1,
                color: "#2D3B55",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: ".07em",
                textTransform: "uppercase",
                textAlign: i === 3 ? "right" : "left",
              }}
            >
              {col}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {ALL_TRANSACTIONS.map((tx, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "11px 14px",
                borderBottom: "1px solid rgba(255,255,255,.025)",
                background: !tx.expense ? "rgba(45,212,191,.025)" : undefined,
              }}
            >
              <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: tx.expense ? "rgba(248,113,113,.1)" : "rgba(45,212,191,.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    flexShrink: 0,
                  }}
                >
                  {tx.emoji}
                </div>
                <div>
                  <p style={{ color: "#C8D3E0", fontSize: 13, fontWeight: 500, marginBottom: 1 }}>{tx.name}</p>
                  <p style={{ color: "#2D3B55", fontSize: 11 }}>{tx.time}</p>
                </div>
              </div>
              <span style={{ flex: 1, color: "#4A5568", fontSize: 12 }}>{tx.category}</span>
              <span style={{ flex: 1, color: "#4A5568", fontSize: 12 }}>{tx.date}</span>
              <span
                style={{ flex: 1, color: tx.expense ? "#F87171" : "#2DD4BF", fontSize: 13, fontWeight: 600, textAlign: "right" }}
              >
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          width: 308,
          background: "#0D1322",
          borderLeft: "1px solid rgba(255,255,255,.04)",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          flexShrink: 0,
          overflowY: "auto",
        }}
      >
        <h3 style={{ color: "#E2E8F0", fontSize: 15, fontWeight: 700 }}>Phân tích tháng 5</h3>

        {/* Donut chart */}
        <div style={{ background: "#141C30", borderRadius: 16, padding: 14, display: "flex", justifyContent: "center" }}>
          <svg viewBox="0 0 160 160" width="134" height="134">
            <circle cx="80" cy="80" r="52" fill="none" stroke="#0B0F1E" strokeWidth="20" />
            <circle cx="80" cy="80" r="52" fill="none" stroke="#7B6EF6" strokeWidth="20" strokeDasharray="114 213" transform="rotate(-90 80 80)" />
            <circle cx="80" cy="80" r="52" fill="none" stroke="#2DD4BF" strokeWidth="20" strokeDasharray="59 268" strokeDashoffset="-114" transform="rotate(-90 80 80)" />
            <circle cx="80" cy="80" r="52" fill="none" stroke="#FFD93D" strokeWidth="20" strokeDasharray="79 248" strokeDashoffset="-173" transform="rotate(-90 80 80)" />
            <circle cx="80" cy="80" r="52" fill="none" stroke="#F87171" strokeWidth="20" strokeDasharray="75 252" strokeDashoffset="-252" transform="rotate(-90 80 80)" />
            <text x="80" y="76" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700" fontFamily="inherit">12.65M đ</text>
            <text x="80" y="91" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="inherit">chi tiêu</text>
          </svg>
        </div>

        {/* Category legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { color: "#7B6EF6", label: "Ăn uống", pct: "35%", val: "4.43M" },
            { color: "#FFD93D", label: "Nhà cửa", pct: "24%", val: "3.04M" },
            { color: "#F87171", label: "Khác", pct: "23%", val: "2.9M" },
            { color: "#2DD4BF", label: "Di chuyển", pct: "18%", val: "2.28M" },
          ].map((cat) => (
            <div key={cat.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ color: "#C8D3E0", fontSize: 12, fontWeight: 500 }}>{cat.label}</span>
                  <span style={{ color: "#C8D3E0", fontSize: 12, fontWeight: 700 }}>{cat.pct} · {cat.val}</span>
                </div>
                <div style={{ height: 3, background: "#141C30", borderRadius: 2 }}>
                  <div style={{ width: cat.pct, height: "100%", background: cat.color, borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Budget summary */}
        <div style={{ background: "#141C30", borderRadius: 14, padding: 14 }}>
          <p style={{ color: "#94A3B8", fontSize: 11, fontWeight: 600, letterSpacing: ".04em", marginBottom: 10 }}>
            NGÂN SÁCH THÁNG 5
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { emoji: "🍜", label: "Ăn uống", pct: "74% ✓", color: "#2DD4BF" },
              { emoji: "🚗", label: "Di chuyển", pct: "64%", color: "#7B6EF6" },
              { emoji: "🎮", label: "Giải trí", pct: "120% ⚠", color: "#F87171", over: true },
              { emoji: "🛍️", label: "Mua sắm", pct: "27%", color: "#64748B" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: item.over ? "8px 10px" : undefined,
                  background: item.over ? "rgba(248,113,113,.07)" : undefined,
                  border: item.over ? "1px solid rgba(248,113,113,.18)" : undefined,
                  borderRadius: item.over ? 8 : undefined,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14 }}>{item.emoji}</span>
                  <span style={{ color: item.over ? "#F87171" : "#C8D3E0", fontSize: 12, fontWeight: item.over ? 500 : 400 }}>
                    {item.label}
                  </span>
                </div>
                <span style={{ color: item.color, fontSize: 12, fontWeight: 700 }}>{item.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Transactions() {
  return (
    <>
      <div className="lg:hidden">
        <MobileTransactions />
      </div>
      <div className="hidden lg:flex h-full">
        <DesktopTransactions />
      </div>
    </>
  );
}
