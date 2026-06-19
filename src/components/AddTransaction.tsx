"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { emoji: "🍜", label: "Ăn uống" },
  { emoji: "🏠", label: "Nhà cửa" },
  { emoji: "🚗", label: "Di chuyển" },
  { emoji: "🎮", label: "Giải trí" },
  { emoji: "📚", label: "Giáo dục" },
  { emoji: "💊", label: "Sức khỏe" },
  { emoji: "🛍️", label: "Mua sắm" },
  { emoji: "⊕", label: "Khác" },
];

export default function AddTransaction() {
  const router = useRouter();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("0");
  const [category, setCategory] = useState("Ăn uống");
  const [note, setNote] = useState("");

  function handleDigit(d: string) {
    setAmount((prev) => {
      if (prev === "0") return d;
      return prev + d;
    });
  }

  function handleBackspace() {
    setAmount((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
  }

  function handleDot() {
    setAmount((prev) => (prev.includes(".") ? prev : prev + "."));
  }

  const formatted = Number(amount).toLocaleString("vi-VN");

  const activeCategory = CATEGORIES.find((c) => c.label === category);

  return (
    <div style={{ background: "#0B0F1E", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "4px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span style={{ color: "#E2E8F0", fontSize: 17, fontWeight: 700 }}>Thêm giao dịch</span>
        <div style={{ width: 36 }} />
      </div>

      {/* Type toggle */}
      <div style={{ padding: "16px 24px", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,.05)",
            borderRadius: 14,
            padding: 4,
            gap: 4,
          }}
        >
          <button
            onClick={() => setType("expense")}
            style={{
              flex: 1,
              padding: 10,
              background: type === "expense" ? "#F87171" : "transparent",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
            }}
          >
            <span style={{ color: type === "expense" ? "#fff" : "#4A5568", fontSize: 14, fontWeight: 700 }}>
              Chi tiêu
            </span>
          </button>
          <button
            onClick={() => setType("income")}
            style={{
              flex: 1,
              padding: 10,
              background: type === "income" ? "#2DD4BF" : "transparent",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
            }}
          >
            <span style={{ color: type === "income" ? "#fff" : "#4A5568", fontSize: 14, fontWeight: 600 }}>
              Thu nhập
            </span>
          </button>
        </div>
      </div>

      {/* Amount display */}
      <div style={{ padding: "0 24px 20px", flexShrink: 0, textAlign: "center" }}>
        <p style={{ color: "#334155", fontSize: 13, marginBottom: 8 }}>Nhập số tiền</p>
        <p style={{ color: "#E2E8F0", fontSize: 44, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>
          {formatted} <span style={{ fontSize: 22, color: "#64748B", fontWeight: 500 }}>đ</span>
        </p>
        <div
          style={{
            height: 2,
            background: "linear-gradient(90deg,transparent,#7B6EF6,transparent)",
            marginTop: 12,
            borderRadius: 1,
          }}
        />
      </div>

      {/* Categories */}
      <div style={{ padding: "0 24px", flexShrink: 0 }}>
        <p style={{ color: "#64748B", fontSize: 12, fontWeight: 600, letterSpacing: ".05em", marginBottom: 12 }}>
          DANH MỤC
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 10,
          }}
        >
          {CATEGORIES.map((cat) => {
            const active = category === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setCategory(cat.label)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: active
                      ? "linear-gradient(135deg,rgba(248,113,113,.2),rgba(248,113,113,.1))"
                      : "rgba(255,255,255,.05)",
                    border: active ? "2px solid #F87171" : "1px solid rgba(255,255,255,.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                >
                  {cat.emoji}
                </div>
                <span style={{ color: active ? "#E2E8F0" : "#64748B", fontSize: 11, fontWeight: active ? 500 : 400 }}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date & Note */}
      <div style={{ padding: "16px 24px 0", flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              flex: 1,
              padding: "12px 14px",
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.07)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#4A5568" strokeWidth="1.5">
              <rect x="2" y="3" width="16" height="16" rx="2" />
              <path d="M14 1v4M6 1v4M2 9h16" />
            </svg>
            <span style={{ color: "#E2E8F0", fontSize: 13 }}>16/05/2025</span>
          </div>
          <div
            style={{
              flex: 1,
              padding: "12px 14px",
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.07)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#4A5568" strokeWidth="1.5">
              <path d="M18 13a2 2 0 01-2 2H5l-3 3V5a2 2 0 012-2h11a2 2 0 012 2z" />
            </svg>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: note ? "#E2E8F0" : "#4A5568",
                fontSize: 13,
                fontFamily: "inherit",
                width: "100%",
              }}
            />
          </div>
        </div>
        <div
          style={{
            padding: "12px 14px",
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#4A5568" strokeWidth="1.5">
            <path d="M1 8a2 2 0 012-2h1l2-3h6l2 3h1a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2z" />
            <circle cx="10" cy="12" r="3" />
          </svg>
          <span style={{ color: "#4A5568", fontSize: 13 }}>Chụp hóa đơn</span>
        </div>
      </div>

      {/* Save button */}
      <div style={{ padding: "16px 24px 30px", flexShrink: 0, marginTop: "auto" }}>
        <button
          onClick={() => router.push("/")}
          style={{
            width: "100%",
            padding: 15,
            background: "linear-gradient(135deg,#7B6EF6,#2DD4BF)",
            borderRadius: 16,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(123,110,246,.35)",
          }}
        >
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>Lưu giao dịch</span>
        </button>
      </div>
    </div>
  );
}
