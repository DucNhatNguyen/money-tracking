"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setBudgetAction, deleteBudgetAction } from "@/app/actions/budget";

type BudgetItem = {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryEmoji: string;
  categoryColor: string;
  budgetAmount: number;
  spentAmount: number;
  pct: number;
  over: boolean;
};

type AvailableCategory = { id: string; name: string; emoji: string; color: string };

type Props = {
  month: number;
  year: number;
  items: BudgetItem[];
  totalBudget: number;
  totalSpent: number;
  availableCategories: AvailableCategory[];
};

const MONTH_NAMES = [
  "Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
  "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12",
];

function fmtVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function fmtShort(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M đ";
  if (n >= 1_000) return Math.round(n / 1_000) + "K đ";
  return fmtVND(n);
}

function fmtAmountInput(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,.04)",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 10,
  padding: "11px 14px",
  color: "#E2E8F0",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
};

// ─── Month navigator ─────────────────────────────────────────────────────────

function MonthNav({ month, year }: { month: number; year: number }) {
  const router = useRouter();
  const now = new Date();
  const isLatest = year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);

  function go(delta: number) {
    let m = month + delta, y = year;
    if (m === 0) { m = 12; y--; }
    if (m === 13) { m = 1; y++; }
    router.push(`/budget?month=${m}&year=${y}`);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 14,
      }}
    >
      <button onClick={() => go(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, lineHeight: 0 }}>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#C8D3E0" strokeWidth="2" strokeLinecap="round">
          <path d="M13 5l-6 5 6 5" />
        </svg>
      </button>
      <span style={{ color: "#E2E8F0", fontSize: 15, fontWeight: 700 }}>
        {MONTH_NAMES[month - 1]}, {year}
      </span>
      <button
        onClick={() => !isLatest && go(1)}
        style={{ background: "none", border: "none", cursor: isLatest ? "default" : "pointer", padding: 4, lineHeight: 0, opacity: isLatest ? 0.25 : 1 }}
      >
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#C8D3E0" strokeWidth="2" strokeLinecap="round">
          <path d="M7 5l6 5-6 5" />
        </svg>
      </button>
    </div>
  );
}

// ─── Overall summary card ─────────────────────────────────────────────────────

function OverallCard({ totalBudget, totalSpent, month }: { totalBudget: number; totalSpent: number; month: number }) {
  const pct = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;
  const over = totalSpent > totalBudget && totalBudget > 0;
  const remaining = totalBudget - totalSpent;

  return (
    <div style={{ padding: 16, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ color: "#94A3B8", fontSize: 12 }}>
          {totalBudget > 0 ? `Tổng ngân sách — ${MONTH_NAMES[month - 1]}` : "Chưa thiết lập ngân sách"}
        </span>
        {totalBudget > 0 && (
          <span style={{ color: "#E2E8F0", fontSize: 12, fontWeight: 600 }}>
            {fmtShort(totalSpent)} / {fmtShort(totalBudget)}
          </span>
        )}
      </div>

      {totalBudget > 0 && (
        <>
          <div style={{ height: 6, background: "#141C30", borderRadius: 3 }}>
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: over ? "#F87171" : "linear-gradient(90deg,#7B6EF6,#2DD4BF)",
                borderRadius: 3,
                transition: "width .3s ease",
              }}
            />
          </div>
          <p style={{ color: over ? "#F87171" : "#2DD4BF", fontSize: 12, marginTop: 6 }}>
            {over
              ? `Đã vượt ${fmtVND(Math.abs(remaining))}`
              : `Còn ${fmtVND(remaining)} có thể chi`}
          </p>
        </>
      )}
    </div>
  );
}

// ─── Add budget panel ─────────────────────────────────────────────────────────

function AddBudgetPanel({
  availableCategories,
  month,
  year,
  onClose,
}: {
  availableCategories: AvailableCategory[];
  month: number;
  year: number;
  onClose: () => void;
}) {
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [amountText, setAmountText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (!selectedCatId) { setError("Vui lòng chọn danh mục."); return; }
    const amount = parseInt(amountText.replace(/\D/g, ""));
    if (!amount || amount <= 0) { setError("Số tiền không hợp lệ."); return; }

    setError(null);
    const fd = new FormData();
    fd.set("categoryId", selectedCatId);
    fd.set("amount", String(amount));
    fd.set("month", String(month));
    fd.set("year", String(year));

    startTransition(async () => {
      const result = await setBudgetAction(null, fd);
      if (!result) {
        onClose();
      } else {
        setError(result.error);
      }
    });
  }

  if (availableCategories.length === 0) {
    return (
      <div style={{ padding: "14px 16px", background: "#141C30", border: "1px solid rgba(255,255,255,.06)", borderRadius: 16, textAlign: "center" }}>
        <p style={{ color: "#64748B", fontSize: 13 }}>Tất cả danh mục đã có ngân sách tháng này.</p>
        <button onClick={onClose} style={{ marginTop: 10, color: "#7B6EF6", background: "none", border: "none", fontSize: 13, cursor: "pointer" }}>Đóng</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, background: "#141C30", border: "1px solid rgba(123,110,246,.2)", borderRadius: 16 }}>
      <p style={{ color: "#94A3B8", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", marginBottom: 12 }}>
        CHỌN DANH MỤC
      </p>

      {/* Category chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        {availableCategories.map((cat) => {
          const active = selectedCatId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCatId(active ? null : cat.id)}
              style={{
                padding: "8px 12px",
                background: active ? `${cat.color}22` : "rgba(255,255,255,.05)",
                border: `1px solid ${active ? cat.color : "rgba(255,255,255,.08)"}`,
                borderRadius: 10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: 15 }}>{cat.emoji}</span>
              <span style={{ color: active ? "#E2E8F0" : "#64748B", fontSize: 13 }}>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Amount input */}
      {selectedCatId && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", color: "#94A3B8", fontSize: 11, fontWeight: 600, letterSpacing: ".04em", marginBottom: 6 }}>
            HẠN MỨC CHI TIÊU (đ)
          </label>
          <div style={{ position: "relative" }}>
            <input
              autoFocus
              value={amountText}
              onChange={(e) => setAmountText(fmtAmountInput(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="VD: 6.000.000"
              style={{ ...inputBase, paddingRight: 36 }}
            />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#64748B", fontSize: 13 }}>đ</span>
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: "#F87171", fontSize: 12, marginBottom: 10 }}>{error}</p>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleSave}
          disabled={isPending || !selectedCatId}
          style={{
            flex: 1,
            padding: "11px 0",
            background: isPending || !selectedCatId ? "rgba(123,110,246,.3)" : "linear-gradient(135deg,#7B6EF6,#5B8DEF)",
            border: "none",
            borderRadius: 10,
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: isPending || !selectedCatId ? "default" : "pointer",
            fontFamily: "inherit",
          }}
        >
          {isPending ? "Đang lưu..." : "Lưu ngân sách"}
        </button>
        <button
          onClick={onClose}
          style={{
            padding: "11px 16px",
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 10,
            color: "#64748B",
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Huỷ
        </button>
      </div>
    </div>
  );
}

// ─── Budget item card ─────────────────────────────────────────────────────────

function BudgetCard({
  item,
  editingId,
  editAmountText,
  confirmingDeleteId,
  isPending,
  onEditToggle,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDeleteAsk,
  onDeleteCancel,
}: {
  item: BudgetItem;
  editingId: string | null;
  editAmountText: string;
  confirmingDeleteId: string | null;
  isPending: boolean;
  onEditToggle: (id: string, amount: number) => void;
  onEditChange: (val: string) => void;
  onEditSave: (item: BudgetItem) => void;
  onEditCancel: () => void;
  onDeleteAsk: (id: string) => void;
  onDeleteCancel: () => void;
}) {
  const isEditing = editingId === item.id;
  const isConfirming = confirmingDeleteId === item.id;
  const warn = item.pct >= 80 && !item.over;

  return (
    <div
      style={{
        padding: 16,
        background: item.over ? "rgba(248,113,113,.06)" : "#141C30",
        border: `1px solid ${item.over ? "rgba(248,113,113,.22)" : warn ? "rgba(251,191,36,.12)" : isEditing ? "rgba(123,110,246,.3)" : "rgba(255,255,255,.06)"}`,
        borderRadius: 16,
        transition: "border-color .15s",
      }}
    >
      {/* Header — tap anywhere to toggle the edit form */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Sửa ngân sách ${item.categoryName}`}
        onClick={() => onEditToggle(item.id, item.budgetAmount)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onEditToggle(item.id, item.budgetAmount); }
        }}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, cursor: "pointer", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 13,
              background: item.over ? "rgba(248,113,113,.15)" : `${item.categoryColor}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {item.categoryEmoji}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: "#C8D3E0", fontSize: 13, fontWeight: 600 }}>{item.categoryName}</p>
            <p style={{ color: item.over ? "#F87171" : "#334155", fontSize: 11, marginTop: 2 }}>
              {fmtVND(item.spentAmount)} / {fmtVND(item.budgetAmount)}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
          <span
            style={{
              color: item.over ? "#F87171" : warn ? "#FBBF24" : item.categoryColor,
              fontSize: 14,
              fontWeight: 700,
              marginRight: 4,
            }}
          >
            {item.pct}%
          </span>

          {/* Edit affordance — rotates when the form is open (part of the row tap) */}
          <svg
            viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round"
            style={{ flexShrink: 0, transform: isEditing ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s ease" }}
          >
            <path d="M5 8l5 5 5-5" />
          </svg>

          {/* Delete — larger target, asks for confirmation */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDeleteAsk(item.id); }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, marginLeft: 2, lineHeight: 0, opacity: 0.55, WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
            title="Xoá ngân sách"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Inline edit form */}
      {isEditing && (
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              autoFocus
              value={editAmountText}
              onChange={(e) => onEditChange(fmtAmountInput(e.target.value))}
              onKeyDown={(e) => { if (e.key === "Enter") onEditSave(item); if (e.key === "Escape") onEditCancel(); }}
              style={{ ...inputBase, paddingRight: 36 }}
            />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#64748B", fontSize: 13 }}>đ</span>
          </div>
          <button
            onClick={() => onEditSave(item)}
            disabled={isPending}
            style={{ padding: "0 16px", background: "linear-gradient(135deg,#7B6EF6,#5B8DEF)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            {isPending ? "..." : "Lưu"}
          </button>
          <button
            onClick={onEditCancel}
            style={{ padding: "0 12px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, color: "#64748B", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
          >
            Huỷ
          </button>
        </div>
      )}

      {/* Delete confirmation */}
      {isConfirming && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 10,
            padding: "10px 12px",
            background: "rgba(248,113,113,.08)",
            border: "1px solid rgba(248,113,113,.2)",
            borderRadius: 12,
          }}
        >
          <span style={{ color: "#F87171", fontSize: 12, fontWeight: 500 }}>
            Xoá ngân sách &ldquo;{item.categoryName}&rdquo;?
          </span>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button
              type="button"
              onClick={onDeleteCancel}
              style={{ padding: "7px 12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 9, color: "#94A3B8", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              Huỷ
            </button>
            <form action={deleteBudgetAction.bind(null, item.id)} style={{ display: "inline" }}>
              <button
                type="submit"
                style={{ padding: "7px 14px", background: "#F87171", border: "none", borderRadius: 9, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
              >
                Xoá
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ height: 5, background: item.over ? "rgba(248,113,113,.15)" : "#0B0F1E", borderRadius: 3 }}>
        <div
          style={{
            width: `${Math.min(item.pct, 100)}%`,
            height: "100%",
            background: item.over ? "#F87171" : warn ? "#FBBF24" : item.categoryColor,
            borderRadius: 3,
          }}
        />
      </div>

      {/* Over-budget warning */}
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
          <span style={{ color: "#F87171", fontSize: 11 }}>
            Đã vượt {fmtVND(item.spentAmount - item.budgetAmount)} so với hạn mức
          </span>
        </div>
      )}

      {/* Near-limit warning */}
      {warn && (
        <p style={{ color: "#FBBF24", fontSize: 11, marginTop: 6 }}>
          Còn {fmtVND(item.budgetAmount - item.spentAmount)} — sắp đạt giới hạn
        </p>
      )}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 24px", gap: 12 }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          background: "rgba(123,110,246,.1)",
          border: "1px solid rgba(123,110,246,.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
        }}
      >
        💰
      </div>
      <p style={{ color: "#C8D3E0", fontSize: 14, fontWeight: 600 }}>Chưa có ngân sách nào</p>
      <p style={{ color: "#334155", fontSize: 12, textAlign: "center", maxWidth: 240 }}>
        Thiết lập hạn mức chi tiêu theo danh mục để kiểm soát tài chính tốt hơn.
      </p>
      <button
        onClick={onAdd}
        style={{
          marginTop: 4,
          padding: "10px 22px",
          background: "linear-gradient(135deg,#7B6EF6,#2DD4BF)",
          border: "none",
          borderRadius: 12,
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        + Thêm ngân sách đầu tiên
      </button>
    </div>
  );
}

// ─── Shared logic hook ────────────────────────────────────────────────────────

function useBudgetInteractions(month: number, year: number) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmountText, setEditAmountText] = useState("");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleEditStart(id: string, amount: number) {
    setConfirmingDeleteId(null);
    setEditingId(id);
    setEditAmountText(fmtAmountInput(String(amount)));
  }

  function handleEditCancel() {
    setEditingId(null);
    setEditAmountText("");
  }

  // Tap a card to toggle its edit form open/closed
  function handleEditToggle(id: string, amount: number) {
    if (editingId === id) handleEditCancel();
    else handleEditStart(id, amount);
  }

  function handleEditSave(item: BudgetItem) {
    const amount = parseInt(editAmountText.replace(/\D/g, ""));
    if (!amount || amount <= 0) return;
    const fd = new FormData();
    fd.set("categoryId", item.categoryId);
    fd.set("amount", String(amount));
    fd.set("month", String(month));
    fd.set("year", String(year));
    startTransition(async () => {
      await setBudgetAction(null, fd);
      setEditingId(null);
      setEditAmountText("");
    });
  }

  return {
    showAdd, setShowAdd,
    editingId, editAmountText,
    confirmingDeleteId,
    isPending,
    handleEditStart,
    handleEditToggle,
    handleEditChange: (val: string) => setEditAmountText(fmtAmountInput(val)),
    handleEditSave,
    handleEditCancel,
    handleDeleteAsk: (id: string) => { setEditingId(null); setConfirmingDeleteId(id); },
    handleDeleteCancel: () => setConfirmingDeleteId(null),
  };
}

// ─── Mobile layout ────────────────────────────────────────────────────────────

function MobileBudget({ month, year, items, totalBudget, totalSpent, availableCategories }: Props) {
  const {
    showAdd, setShowAdd,
    editingId, editAmountText, confirmingDeleteId, isPending,
    handleEditToggle, handleEditChange, handleEditSave, handleEditCancel,
    handleDeleteAsk, handleDeleteCancel,
  } = useBudgetInteractions(month, year);

  return (
    <div style={{ background: "#0B0F1E", minHeight: "100%", paddingBottom: 24 }}>
      {/* Sticky header — title + add + month nav + overall summary stay pinned */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "#0B0F1E",
          padding: "12px 24px 14px",
          borderBottom: "1px solid rgba(255,255,255,.05)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 800 }}>Ngân sách</span>
          {availableCategories.length > 0 && !showAdd && (
            <button
              onClick={() => setShowAdd(true)}
              style={{
                padding: "7px 14px",
                background: "linear-gradient(135deg,rgba(123,110,246,.15),rgba(45,212,191,.1))",
                border: "1px solid rgba(123,110,246,.25)",
                borderRadius: 10,
                color: "#7B6EF6",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              + Thêm mục
            </button>
          )}
        </div>
        <MonthNav month={month} year={year} />
        <div style={{ marginTop: 14 }}>
          <OverallCard totalBudget={totalBudget} totalSpent={totalSpent} month={month} />
        </div>
      </div>

      {/* Add panel */}
      {showAdd && (
        <div style={{ padding: "16px 24px 0" }}>
          <AddBudgetPanel
            availableCategories={availableCategories}
            month={month}
            year={year}
            onClose={() => setShowAdd(false)}
          />
        </div>
      )}

      {/* Budget list or empty state */}
      <div style={{ padding: "16px 24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {items.length === 0 && !showAdd ? (
          <EmptyState onAdd={() => setShowAdd(true)} />
        ) : (
          items.map((item) => (
            <BudgetCard
              key={item.id}
              item={item}
              editingId={editingId}
              editAmountText={editAmountText}
              confirmingDeleteId={confirmingDeleteId}
              isPending={isPending}
              onEditToggle={handleEditToggle}
              onEditChange={handleEditChange}
              onEditSave={handleEditSave}
              onEditCancel={handleEditCancel}
              onDeleteAsk={handleDeleteAsk}
              onDeleteCancel={handleDeleteCancel}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Desktop layout ───────────────────────────────────────────────────────────

function DesktopBudget({ month, year, items, totalBudget, totalSpent, availableCategories }: Props) {
  const {
    showAdd, setShowAdd,
    editingId, editAmountText, confirmingDeleteId, isPending,
    handleEditToggle, handleEditChange, handleEditSave, handleEditCancel,
    handleDeleteAsk, handleDeleteCancel,
  } = useBudgetInteractions(month, year);

  const overCount = items.filter((i) => i.over).length;

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Main: budget list */}
      <div style={{ flex: 1, padding: "22px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div>
            <h2 style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 800, marginBottom: 2 }}>Ngân sách</h2>
            <p style={{ color: "#3D4B60", fontSize: 12 }}>
              {MONTH_NAMES[month - 1]}, {year}
              {overCount > 0 && <span style={{ color: "#F87171", marginLeft: 8 }}>· {overCount} danh mục vượt hạn</span>}
            </p>
          </div>
          {availableCategories.length > 0 && !showAdd && (
            <button
              onClick={() => setShowAdd(true)}
              style={{
                padding: "9px 16px",
                background: "linear-gradient(135deg,rgba(123,110,246,.15),rgba(45,212,191,.1))",
                border: "1px solid rgba(123,110,246,.25)",
                borderRadius: 10,
                color: "#7B6EF6",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              + Thêm mục
            </button>
          )}
        </div>

        {showAdd && (
          <AddBudgetPanel
            availableCategories={availableCategories}
            month={month}
            year={year}
            onClose={() => setShowAdd(false)}
          />
        )}

        {items.length === 0 && !showAdd ? (
          <EmptyState onAdd={() => setShowAdd(true)} />
        ) : (
          items.map((item) => (
            <BudgetCard
              key={item.id}
              item={item}
              editingId={editingId}
              editAmountText={editAmountText}
              confirmingDeleteId={confirmingDeleteId}
              isPending={isPending}
              onEditToggle={handleEditToggle}
              onEditChange={handleEditChange}
              onEditSave={handleEditSave}
              onEditCancel={handleEditCancel}
              onDeleteAsk={handleDeleteAsk}
              onDeleteCancel={handleDeleteCancel}
            />
          ))
        )}
      </div>

      {/* Right panel: summary */}
      <div
        style={{
          width: 300,
          background: "#0D1322",
          borderLeft: "1px solid rgba(255,255,255,.04)",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          flexShrink: 0,
          overflowY: "auto",
        }}
      >
        <MonthNav month={month} year={year} />
        <OverallCard totalBudget={totalBudget} totalSpent={totalSpent} month={month} />

        {/* Stats */}
        {items.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ color: "#94A3B8", fontSize: 11, fontWeight: 600, letterSpacing: ".04em" }}>THEO DANH MỤC</p>
            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{item.categoryEmoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ color: "#C8D3E0", fontSize: 12 }}>{item.categoryName}</span>
                    <span style={{ color: item.over ? "#F87171" : "#64748B", fontSize: 11, fontWeight: 600 }}>
                      {item.pct}%
                    </span>
                  </div>
                  <div style={{ height: 3, background: "#0B0F1E", borderRadius: 2 }}>
                    <div
                      style={{
                        width: `${Math.min(item.pct, 100)}%`,
                        height: "100%",
                        background: item.over ? "#F87171" : item.pct >= 80 ? "#FBBF24" : item.categoryColor,
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tip */}
        <div style={{ padding: "12px 14px", background: "rgba(123,110,246,.06)", border: "1px solid rgba(123,110,246,.12)", borderRadius: 12 }}>
          <p style={{ color: "#7B6EF6", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>💡 MẸO</p>
          <p style={{ color: "#475569", fontSize: 11, lineHeight: 1.6 }}>
            Nên đặt ngân sách cho các danh mục chi nhiều nhất. Hệ thống sẽ cảnh báo khi bạn đạt 80% hạn mức.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function Budget(props: Props) {
  return (
    <>
      <div className="lg:hidden">
        <MobileBudget {...props} />
      </div>
      <div className="hidden lg:flex h-full">
        <DesktopBudget {...props} />
      </div>
    </>
  );
}
