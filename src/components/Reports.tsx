"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type CatStat = { name: string; emoji: string; color: string; total: number; pct: number };
type TrendItem = { month: number; year: number; income: number; expense: number };

type Props = {
  month: number;
  year: number;
  income: number;
  expense: number;
  balance: number;
  categories: CatStat[];
  trend: TrendItem[];
};

const MONTH_NAMES = [
  "Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
  "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12",
];

const CIRC = 2 * Math.PI * 52;

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return Math.round(n / 1_000) + "K";
  return n.toLocaleString("vi-VN");
}

function fmtFull(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function buildArcs(cats: CatStat[]) {
  let cumulative = 0;
  return cats.slice(0, 6).map((c) => {
    const dash = (c.pct / 100) * CIRC;
    const arc = {
      color: c.color,
      dashArray: `${dash.toFixed(2)} ${(CIRC - dash).toFixed(2)}`,
      dashOffset: -cumulative,
    };
    cumulative += dash;
    return arc;
  });
}

// ─── Month navigator ─────────────────────────────────────────────────────────

function MonthNav({ month, year }: { month: number; year: number }) {
  const router = useRouter();
  const now = new Date();
  const isLatest =
    year > now.getFullYear() ||
    (year === now.getFullYear() && month >= now.getMonth() + 1);

  function go(delta: number) {
    let m = month + delta;
    let y = year;
    if (m === 0) { m = 12; y--; }
    if (m === 13) { m = 1; y++; }
    router.push(`/reports?month=${m}&year=${y}`);
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
      <button
        onClick={() => go(-1)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, lineHeight: 0 }}
      >
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

// ─── Summary cards ────────────────────────────────────────────────────────────

function SummaryCards({ income, expense, balance }: Pick<Props, "income" | "expense" | "balance">) {
  const cards = [
    { label: "Thu nhập", value: fmt(income), unit: "đ", bg: "rgba(45,212,191,.08)", border: "rgba(45,212,191,.14)", textC: "#2D5450", valC: "#2DD4BF" },
    { label: "Chi tiêu", value: fmt(expense), unit: "đ", bg: "rgba(248,113,113,.08)", border: "rgba(248,113,113,.14)", textC: "#553A3A", valC: "#F87171" },
    { label: "Tiết kiệm", value: fmt(Math.abs(balance)), unit: "đ", bg: balance >= 0 ? "rgba(123,110,246,.08)" : "rgba(248,113,113,.08)", border: balance >= 0 ? "rgba(123,110,246,.14)" : "rgba(248,113,113,.14)", textC: balance >= 0 ? "#3D3460" : "#553A3A", valC: balance >= 0 ? "#7B6EF6" : "#F87171" },
  ];
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {cards.map((c) => (
        <div key={c.label} style={{ flex: 1, padding: "10px 12px", background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14 }}>
          <p style={{ color: c.textC, fontSize: 11, marginBottom: 4 }}>{c.label}</p>
          <p style={{ color: c.valC, fontSize: 15, fontWeight: 700, lineHeight: 1 }}>
            {c.value}<span style={{ fontSize: 10, fontWeight: 500 }}>{c.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Bar chart (6-month trend) ────────────────────────────────────────────────

function BarChart({ trend, activeMonth, activeYear }: { trend: TrendItem[]; activeMonth: number; activeYear: number }) {
  const maxVal = Math.max(...trend.flatMap((t) => [t.income, t.expense]), 1);
  const H = 80;
  const GW = 50;
  const BW = 15;
  const TOTAL_W = GW * trend.length;

  return (
    <div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
        {[{ color: "#2DD4BF", label: "Thu nhập" }, { color: "#F87171", label: "Chi tiêu" }].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
            <span style={{ color: "#64748B", fontSize: 11 }}>{l.label}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${TOTAL_W} ${H + 22}`} width="100%" style={{ display: "block", overflow: "visible" }}>
        {trend.map((t, i) => {
          const gx = i * GW;
          const incH = (t.income / maxVal) * H;
          const expH = (t.expense / maxVal) * H;
          const isActive = t.month === activeMonth && t.year === activeYear;

          return (
            <Link key={`${t.month}-${t.year}`} href={`/reports?month=${t.month}&year=${t.year}`}>
              <g style={{ cursor: "pointer" }}>
                {/* Active highlight */}
                {isActive && (
                  <rect x={gx + 2} y={0} width={GW - 4} height={H} rx={6} fill="rgba(123,110,246,.07)" />
                )}

                {/* Income bar */}
                {t.income > 0 ? (
                  <rect x={gx + 5} y={H - incH} width={BW} height={incH} rx={3} fill="#2DD4BF" opacity={isActive ? 1 : 0.55} />
                ) : (
                  <rect x={gx + 5} y={H - 2} width={BW} height={2} rx={1} fill="#1C2540" />
                )}

                {/* Expense bar */}
                {t.expense > 0 ? (
                  <rect x={gx + 5 + BW + 4} y={H - expH} width={BW} height={expH} rx={3} fill="#F87171" opacity={isActive ? 1 : 0.55} />
                ) : (
                  <rect x={gx + 5 + BW + 4} y={H - 2} width={BW} height={2} rx={1} fill="#1C2540" />
                )}

                {/* Month label */}
                <text
                  x={gx + GW / 2}
                  y={H + 16}
                  textAnchor="middle"
                  fill={isActive ? "#7B6EF6" : "#334155"}
                  fontSize="9"
                  fontWeight={isActive ? "700" : "400"}
                  fontFamily="inherit"
                >
                  T{t.month}{t.year !== activeYear ? `/${String(t.year).slice(2)}` : ""}
                </text>
              </g>
            </Link>
          );
        })}

        {/* Baseline */}
        <line x1={0} y1={H} x2={TOTAL_W} y2={H} stroke="rgba(255,255,255,.05)" strokeWidth={1} />
      </svg>
    </div>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────

function DonutChart({ categories, expense }: { categories: CatStat[]; expense: number }) {
  const arcs = buildArcs(categories);
  if (categories.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 148, gap: 8 }}>
        <span style={{ fontSize: 28 }}>📊</span>
        <p style={{ color: "#334155", fontSize: 12 }}>Chưa có chi tiêu</p>
      </div>
    );
  }
  return (
    <svg viewBox="0 0 160 160" width="148" height="148" style={{ display: "block", margin: "0 auto" }}>
      <circle cx="80" cy="80" r="52" fill="none" stroke="#141C30" strokeWidth="20" />
      {arcs.map((arc, i) => (
        <circle key={i} cx="80" cy="80" r="52" fill="none" stroke={arc.color} strokeWidth="20"
          strokeDasharray={arc.dashArray} strokeDashoffset={arc.dashOffset} transform="rotate(-90 80 80)" />
      ))}
      <text x="80" y="75" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontWeight="700" fontFamily="inherit">
        {fmt(expense)}M
      </text>
      <text x="80" y="90" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="inherit">chi tiêu</text>
    </svg>
  );
}

// ─── Category list ────────────────────────────────────────────────────────────

function CategoryList({ categories }: { categories: CatStat[] }) {
  if (categories.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", gap: 6 }}>
        <p style={{ color: "#334155", fontSize: 13 }}>Không có dữ liệu chi tiêu</p>
        <Link href="/add" style={{ color: "#7B6EF6", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>+ Thêm giao dịch</Link>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {categories.map((cat) => (
        <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>{cat.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ color: "#C8D3E0", fontSize: 13, fontWeight: 500 }}>{cat.name}</span>
              <span style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600 }}>
                {cat.pct}% · {fmtFull(cat.total)}
              </span>
            </div>
            <div style={{ height: 4, background: "#141C30", borderRadius: 2 }}>
              <div style={{ width: `${cat.pct}%`, height: "100%", background: cat.color, borderRadius: 2 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Mobile layout ────────────────────────────────────────────────────────────

function MobileReports({ month, year, income, expense, balance, categories, trend }: Props) {
  return (
    <div style={{ background: "#0B0F1E", minHeight: "100%", paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ padding: "4px 24px 14px" }}>
        <span style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 800 }}>Báo cáo</span>
        <div style={{ marginTop: 14 }}>
          <MonthNav month={month} year={year} />
        </div>
      </div>

      {/* Summary */}
      <div style={{ padding: "0 24px 16px" }}>
        <SummaryCards income={income} expense={expense} balance={balance} />
      </div>

      {/* Bar chart */}
      <div style={{ padding: "0 24px 16px" }}>
        <p style={{ color: "#64748B", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", marginBottom: 12 }}>
          XU HƯỚNG 6 THÁNG
        </p>
        <div style={{ background: "#141C30", borderRadius: 16, padding: "14px 16px" }}>
          <BarChart trend={trend} activeMonth={month} activeYear={year} />
        </div>
      </div>

      {/* Donut */}
      <div style={{ padding: "0 24px 16px" }}>
        <p style={{ color: "#64748B", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", marginBottom: 12 }}>
          CHI TIÊU THEO DANH MỤC
        </p>
        <div style={{ background: "#141C30", borderRadius: 16, padding: 14 }}>
          <DonutChart categories={categories} expense={expense} />
        </div>
      </div>

      {/* Category list */}
      <div style={{ padding: "0 24px" }}>
        <CategoryList categories={categories} />
      </div>
    </div>
  );
}

// ─── Desktop layout ───────────────────────────────────────────────────────────

function DesktopReports({ month, year, income, expense, balance, categories, trend }: Props) {
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Left: charts */}
      <div style={{ flex: 1, padding: "22px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <h2 style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 800, marginBottom: 2 }}>Báo cáo</h2>
          <p style={{ color: "#3D4B60", fontSize: 12 }}>{MONTH_NAMES[month - 1]}, {year}</p>
        </div>

        {/* Bar chart card */}
        <div style={{ background: "#141C30", borderRadius: 18, padding: "18px 20px" }}>
          <p style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600, letterSpacing: ".04em", marginBottom: 14 }}>
            XU HƯỚNG 6 THÁNG — Nhấn cột để chọn tháng
          </p>
          <BarChart trend={trend} activeMonth={month} activeYear={year} />
        </div>

        {/* Category breakdown */}
        <div style={{ background: "#141C30", borderRadius: 18, padding: "18px 20px" }}>
          <p style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600, letterSpacing: ".04em", marginBottom: 16 }}>
            CHI TIÊU THEO DANH MỤC
          </p>
          <CategoryList categories={categories} />
        </div>
      </div>

      {/* Right: summary + donut */}
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

        <SummaryCards income={income} expense={expense} balance={balance} />

        {/* Donut */}
        <div style={{ background: "#141C30", borderRadius: 16, padding: 14 }}>
          <p style={{ color: "#94A3B8", fontSize: 11, fontWeight: 600, letterSpacing: ".04em", marginBottom: 12 }}>
            CƠ CẤU CHI TIÊU
          </p>
          <DonutChart categories={categories} expense={expense} />
        </div>

        {/* Savings highlight */}
        <div
          style={{
            padding: "14px 16px",
            background: balance >= 0 ? "rgba(123,110,246,.08)" : "rgba(248,113,113,.08)",
            border: `1px solid ${balance >= 0 ? "rgba(123,110,246,.2)" : "rgba(248,113,113,.2)"}`,
            borderRadius: 14,
          }}
        >
          <p style={{ color: "#64748B", fontSize: 11, fontWeight: 600, letterSpacing: ".04em", marginBottom: 6 }}>
            {balance >= 0 ? "TIẾT KIỆM ĐƯỢC" : "THÂM HỤT"}
          </p>
          <p style={{ color: balance >= 0 ? "#7B6EF6" : "#F87171", fontSize: 22, fontWeight: 800 }}>
            {balance >= 0 ? "+" : "−"}{fmtFull(Math.abs(balance))}
          </p>
          {income > 0 && (
            <p style={{ color: "#334155", fontSize: 11, marginTop: 4 }}>
              {Math.round((Math.abs(balance) / income) * 100)}% so với thu nhập
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function Reports(props: Props) {
  return (
    <>
      <div className="lg:hidden">
        <MobileReports {...props} />
      </div>
      <div className="hidden lg:flex h-full">
        <DesktopReports {...props} />
      </div>
    </>
  );
}
