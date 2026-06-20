"use client";
import { useState } from "react";

const SECTIONS = [
  {
    emoji: "📊",
    title: "Dashboard",
    color: "#2DD4BF",
    items: [
      "Xem tổng thu nhập, chi tiêu và số dư tháng hiện tại ngay trên màn hình chính.",
      "5 giao dịch gần nhất được hiển thị để bạn theo dõi nhanh.",
      "Biểu đồ tròn phân tích chi tiêu theo danh mục trong tháng.",
    ],
  },
  {
    emoji: "➕",
    title: "Thêm giao dịch",
    color: "#7B6EF6",
    items: [
      "Chọn loại Thu nhập hoặc Chi tiêu ở thanh trên cùng.",
      "Nhập số tiền bằng bàn phím số. Bấm ⌫ để xóa.",
      "Chọn danh mục phù hợp từ lưới bên dưới.",
      "Chọn ngày — có thể chọn ngày quá khứ nếu bạn quên nhập.",
      "Thêm ghi chú (tùy chọn) để dễ tra cứu sau này.",
      "Nhấn 'Lưu' để ghi lại giao dịch.",
    ],
  },
  {
    emoji: "📋",
    title: "Lịch sử giao dịch",
    color: "#F59E0B",
    items: [
      "Xem toàn bộ giao dịch được nhóm theo ngày (Hôm nay / Hôm qua / ngày cụ thể).",
      "Nhấn vào tab tháng để lọc giao dịch theo tháng.",
      "Nhấn '+ Thêm mới' từ tháng bất kỳ để thêm giao dịch đúng vào tháng đó.",
      "Bảng phân tích và biểu đồ tròn hiển thị trên máy tính.",
    ],
  },
  {
    emoji: "📈",
    title: "Báo cáo",
    color: "#34D399",
    items: [
      "Biểu đồ cột thể hiện xu hướng thu chi 6 tháng gần nhất.",
      "Nhấn vào cột tháng bất kỳ để chuyển sang xem tháng đó.",
      "Biểu đồ tròn và bảng chi tiết phân tích chi tiêu theo danh mục.",
      "Tỷ lệ tiết kiệm được tính tự động từ thu nhập và chi tiêu.",
    ],
  },
  {
    emoji: "💰",
    title: "Ngân sách",
    color: "#FB923C",
    items: [
      "Nhấn '+ Thêm ngân sách' để đặt hạn mức chi tiêu theo danh mục.",
      "Thanh tiến độ chuyển vàng khi đạt 80%, đỏ khi vượt hạn mức.",
      "Nhấn biểu tượng ✏️ để chỉnh sửa ngân sách hiện có.",
      "Nhấn biểu tượng 🗑️ để xóa ngân sách.",
      "Số tiền còn lại hoặc vượt ngân sách được hiển thị rõ ràng.",
    ],
  },
];

export default function HelpGuide() {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <>
      {/* ── Floating button — mobile (above bottom nav) ── */}
      <button
        type="button"
        className="lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Hướng dẫn sử dụng"
        style={{
          position: "fixed",
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 84px)",
          right: 16,
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#7B6EF6,#5B52D6)",
          border: "2px solid rgba(123,110,246,.3)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(123,110,246,.55)",
          zIndex: 45,
          WebkitTapHighlightColor: "transparent",
        } as React.CSSProperties}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
        </svg>
      </button>

      {/* ── Floating button — desktop ── */}
      <button
        type="button"
        className="hidden lg:flex"
        onClick={() => setOpen(true)}
        aria-label="Hướng dẫn sử dụng"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#7B6EF6,#5B52D6)",
          border: "2px solid rgba(123,110,246,.3)",
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(123,110,246,.55)",
          zIndex: 45,
          WebkitTapHighlightColor: "transparent",
        } as React.CSSProperties}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
        </svg>
      </button>

      {/* ── Backdrop ── */}
      <div
        onClick={() => { setOpen(false); setActiveIdx(null); }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.6)",
          backdropFilter: "blur(3px)",
          zIndex: 55,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .25s ease",
        }}
      />

      {/* ── Panel (bottom sheet on mobile, centered modal on desktop) ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: "84vh",
          background: "#0D1322",
          borderRadius: "22px 22px 0 0",
          borderTop: "1px solid rgba(255,255,255,.07)",
          zIndex: 60,
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform .32s cubic-bezier(.4,0,.2,1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Drag handle */}
        <div style={{ paddingTop: 10, paddingBottom: 0, display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, background: "rgba(255,255,255,.1)", borderRadius: 2 }} />
        </div>

        {/* Header */}
        <div style={{ padding: "14px 20px 12px", borderBottom: "1px solid rgba(255,255,255,.04)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <p style={{ color: "#E2E8F0", fontSize: 16, fontWeight: 800 }}>Hướng dẫn sử dụng</p>
            <p style={{ color: "#334155", fontSize: 11, marginTop: 1 }}>FinFamily · Quản lý chi tiêu gia đình</p>
          </div>
          <button
            type="button"
            onClick={() => { setOpen(false); setActiveIdx(null); }}
            style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
          >
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round">
              <path d="M15 5L5 15M5 5l10 10" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 36px" }}>
          {/* Quick tip banner */}
          <div style={{ padding: "10px 14px", background: "rgba(45,212,191,.06)", border: "1px solid rgba(45,212,191,.12)", borderRadius: 12, marginBottom: 16 }}>
            <p style={{ color: "#2DD4BF", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>💡 Mẹo hay</p>
            <p style={{ color: "#64748B", fontSize: 12, lineHeight: 1.5 }}>
              Nhập giao dịch đều đặn mỗi ngày và đặt ngân sách theo danh mục để kiểm soát chi tiêu hiệu quả nhất.
            </p>
          </div>

          {/* Accordion sections */}
          {SECTIONS.map((section, idx) => {
            const isOpen = activeIdx === idx;
            return (
              <div key={section.title} style={{ marginBottom: 8 }}>
                <button
                  type="button"
                  onClick={() => setActiveIdx(isOpen ? null : idx)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    background: isOpen ? "#141C30" : "rgba(255,255,255,.03)",
                    border: `1px solid ${isOpen ? section.color + "33" : "rgba(255,255,255,.06)"}`,
                    borderRadius: isOpen ? "12px 12px 0 0" : 12,
                    cursor: "pointer",
                    textAlign: "left",
                    WebkitTapHighlightColor: "transparent",
                    transition: "background .15s, border-color .15s",
                  } as React.CSSProperties}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: `${section.color}18`, border: `1px solid ${section.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {section.emoji}
                  </div>
                  <span style={{ flex: 1, color: isOpen ? "#E2E8F0" : "#94A3B8", fontSize: 14, fontWeight: isOpen ? 700 : 500 }}>
                    {section.title}
                  </span>
                  <svg
                    viewBox="0 0 20 20" width="16" height="16" fill="none"
                    stroke={isOpen ? section.color : "#334155"} strokeWidth="2" strokeLinecap="round"
                    style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s ease" }}
                  >
                    <path d="M5 8l5 5 5-5" />
                  </svg>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div style={{ padding: "10px 14px 14px", background: "#141C30", border: `1px solid ${section.color}33`, borderTop: "none", borderRadius: "0 0 12px 12px" }}>
                    {section.items.map((item, ii) => (
                      <div key={ii} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "5px 0" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: section.color, flexShrink: 0, marginTop: 7 }} />
                        <span style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.55 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Version footer */}
          <p style={{ color: "#1E293B", fontSize: 11, textAlign: "center", marginTop: 20 }}>
            FinFamily v0.1 · Quản lý tài chính gia đình
          </p>
        </div>
      </div>
    </>
  );
}
