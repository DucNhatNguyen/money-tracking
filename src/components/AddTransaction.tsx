"use client";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { addTransactionAction } from "@/app/actions/transactions";

interface Category { id: string; name: string; emoji: string; color: string; }

const NUMPAD = [["1","2","3"],["4","5","6"],["7","8","9"],[".", "0","⌫"]];

const FALLBACK_CATS: Category[] = [
  { id: "_food", name: "Ăn uống", emoji: "🍜", color: "#FF6B6B" },
  { id: "_home", name: "Nhà cửa", emoji: "🏠", color: "#4ECDC4" },
  { id: "_travel", name: "Di chuyển", emoji: "🚗", color: "#45B7D1" },
  { id: "_fun", name: "Giải trí", emoji: "🎮", color: "#DDA0DD" },
  { id: "_edu", name: "Giáo dục", emoji: "📚", color: "#98FB98" },
  { id: "_health", name: "Sức khỏe", emoji: "💊", color: "#FFEAA7" },
  { id: "_shop", name: "Mua sắm", emoji: "🛍️", color: "#96CEB4" },
  { id: "_other", name: "Khác", emoji: "📦", color: "#D3D3D3" },
];

export default function AddTransaction({
  categories = [],
  defaultDate,
  todayStr,
}: {
  categories?: Category[];
  defaultDate?: string;
  todayStr?: string;
}) {
  const router = useRouter();
  const usingFallback = categories.length === 0;
  const cats = usingFallback ? FALLBACK_CATS : categories;
  const today = todayStr ?? new Date().toISOString().slice(0, 10);

  const [type, setType] = useState<"expense" | "income">("expense");
  const [raw, setRaw] = useState("0");
  const [categoryId, setCategoryId] = useState(cats[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(defaultDate ?? today);
  const [formError, formAction, isPending] = useActionState(addTransactionAction, null);

  function handleKey(key: string) {
    if (key === "⌫") { setRaw((p) => (p.length <= 1 ? "0" : p.slice(0, -1))); return; }
    if (key === ".") { setRaw((p) => (p.includes(".") ? p : p + ".")); return; }
    setRaw((p) => (p === "0" ? key : p + key));
  }

  const formatted = Number(raw).toLocaleString("vi-VN");
  const accent = type === "expense" ? "#F87171" : "#2DD4BF";
  const gradientBtn = type === "expense"
    ? "linear-gradient(135deg,#F87171,#ef4444)"
    : "linear-gradient(135deg,#7B6EF6,#2DD4BF)";

  // Shared sub-sections rendered in both mobile & desktop
  const typeToggle = (
    <div style={{ padding: "14px 20px 0" }}>
      <div style={{ display: "flex", background: "rgba(255,255,255,.05)", borderRadius: 14, padding: 4, gap: 4 }}>
        {(["expense", "income"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setType(t)}
            style={{ flex: 1, height: 44, background: type === t ? (t === "expense" ? "#F87171" : "#2DD4BF") : "transparent", borderRadius: 10, border: "none", cursor: "pointer", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}>
            <span style={{ color: type === t ? "#fff" : "#4A5568", fontSize: 14, fontWeight: 700 }}>
              {t === "expense" ? "Chi tiêu" : "Thu nhập"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const amountDisplay = (
    <div style={{ padding: "16px 20px 14px", textAlign: "center" }}>
      <p style={{ color: "#334155", fontSize: 11, fontWeight: 600, letterSpacing: ".05em", marginBottom: 8 }}>SỐ TIỀN</p>
      <p style={{ color: accent, fontSize: raw.length > 9 ? 30 : 40, fontWeight: 800, letterSpacing: -1, lineHeight: 1, transition: "color .15s" }}>
        {formatted}<span style={{ fontSize: 18, color: "#475569", fontWeight: 500 }}> đ</span>
      </p>
      <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${accent},transparent)`, marginTop: 12, borderRadius: 1 }} />
    </div>
  );

  const numpad = (
    <div style={{ padding: "0 20px 14px" }}>
      {NUMPAD.map((row, ri) => (
        <div key={ri} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: ri < NUMPAD.length - 1 ? 8 : 0 }}>
          {row.map((key) => {
            const isBack = key === "⌫";
            return (
              <button key={key} type="button" onClick={() => handleKey(key)}
                style={{ height: 54, borderRadius: 14, background: isBack ? "rgba(248,113,113,.1)" : "rgba(255,255,255,.05)", border: isBack ? "1px solid rgba(248,113,113,.2)" : "1px solid rgba(255,255,255,.07)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}>
                {isBack ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
                    <line x1="18" y1="9" x2="12" y2="15" /><line x1="12" y1="9" x2="18" y2="15" />
                  </svg>
                ) : (
                  <span style={{ color: key === "." ? "#94A3B8" : "#E2E8F0", fontSize: 22, fontWeight: 500 }}>{key}</span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );

  // Category grid — 5 columns, no scroll → fixes iOS tap-conflict with vertical scroll
  const categoryGrid = (
    <div style={{ padding: "8px 20px 0" }}>
      <p style={{ color: "#64748B", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", marginBottom: 10 }}>DANH MỤC</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {cats.map((cat) => {
          const active = categoryId === cat.id;
          return (
            <button key={cat.id} type="button" onClick={() => setCategoryId(cat.id)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, background: "transparent", border: "none", cursor: "pointer", padding: "4px 0", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: active ? `${cat.color}22` : "rgba(255,255,255,.05)", border: active ? `2px solid ${cat.color}` : "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, transition: "border .1s, background .1s" }}>
                {cat.emoji}
              </div>
              <span style={{ color: active ? "#E2E8F0" : "#64748B", fontSize: 10, fontWeight: active ? 600 : 400, textAlign: "center", lineHeight: 1.2 }}>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const dateInput = (
    <div style={{ padding: "12px 20px 0" }}>
      <div style={{ padding: "13px 14px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 13, display: "flex", alignItems: "center", gap: 8 }}>
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#4A5568" strokeWidth="1.5" style={{ flexShrink: 0 }}>
          <rect x="2" y="3" width="16" height="15" rx="2" />
          <path d="M2 7h16M6 1v4M14 1v4" />
        </svg>
        <input
          type="date"
          value={date}
          max={today}
          onChange={(e) => setDate(e.target.value)}
          style={{ background: "transparent", border: "none", outline: "none", color: "#E2E8F0", fontSize: 13, fontFamily: "inherit", width: "100%", colorScheme: "dark" }}
        />
      </div>
    </div>
  );

  const noteInput = (
    <div style={{ padding: "10px 20px 0" }}>
      <div style={{ padding: "13px 14px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 13, display: "flex", alignItems: "center", gap: 8 }}>
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#4A5568" strokeWidth="1.5" style={{ flexShrink: 0 }}>
          <path d="M18 13a2 2 0 01-2 2H5l-3 3V5a2 2 0 012-2h11a2 2 0 012 2z" />
        </svg>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Thêm ghi chú..."
          style={{ background: "transparent", border: "none", outline: "none", color: note ? "#E2E8F0" : "#4A5568", fontSize: 13, fontFamily: "inherit", width: "100%" }} />
      </div>
    </div>
  );

  const errorBanner = formError?.error ? (
    <div style={{ margin: "10px 20px 0", background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)", borderRadius: 10, padding: "10px 14px", color: "#F87171", fontSize: 13 }}>
      {formError.error}
    </div>
  ) : usingFallback ? (
    <div style={{ margin: "10px 20px 0", background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)", borderRadius: 10, padding: "10px 14px", color: "#F87171", fontSize: 13 }}>
      Chưa có danh mục trong DB. Vui lòng chạy <code>npm run seed</code>.
    </div>
  ) : null;

  const saveBtn = (
    <button type="submit" disabled={isPending}
      style={{ width: "100%", height: 52, background: isPending ? "rgba(123,110,246,.4)" : gradientBtn, borderRadius: 16, border: "none", cursor: isPending ? "default" : "pointer", boxShadow: isPending ? "none" : `0 8px 24px ${accent}44`, transition: "box-shadow .15s", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}>
      <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>
        {isPending ? "Đang lưu..." : type === "expense" ? "Lưu chi tiêu" : "Lưu thu nhập"}
      </span>
    </button>
  );

  return (
    <div style={{ background: "#0B0F1E", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <button type="button" onClick={() => router.back()}
          style={{ width: 42, height: 42, borderRadius: 13, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span style={{ color: "#E2E8F0", fontSize: 16, fontWeight: 700 }}>Thêm giao dịch</span>
        <div style={{ width: 42 }} />
      </div>

      {/* ── MOBILE layout (default, hidden on lg) ── */}
      <div className="lg:hidden" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {typeToggle}
        {amountDisplay}
        {numpad}
        {categoryGrid}
        {dateInput}
        {noteInput}
        {errorBanner}
        <form action={formAction} style={{ padding: "14px 20px 32px", marginTop: "auto" }}>
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="amount" value={raw} />
          <input type="hidden" name="categoryId" value={categoryId} />
          <input type="hidden" name="note" value={note} />
          <input type="hidden" name="date" value={date} />
          {saveBtn}
        </form>
      </div>

      {/* ── DESKTOP layout (hidden on mobile, shown on lg) ── */}
      <div className="hidden lg:flex" style={{ flex: 1, gap: 0 }}>
        {/* Left column: type toggle + amount + numpad */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,.06)", padding: "0 0 32px" }}>
          {typeToggle}
          {amountDisplay}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {numpad}
          </div>
        </div>

        {/* Right column: categories + date + note + submit */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 0 32px" }}>
          <div style={{ flex: 1 }}>
            {categoryGrid}
            {dateInput}
            {noteInput}
            {errorBanner}
          </div>
          <form action={formAction} style={{ padding: "14px 20px 0", flexShrink: 0 }}>
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="amount" value={raw} />
            <input type="hidden" name="categoryId" value={categoryId} />
            <input type="hidden" name="note" value={note} />
            <input type="hidden" name="date" value={date} />
            {saveBtn}
          </form>
        </div>
      </div>
    </div>
  );
}
