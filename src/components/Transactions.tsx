"use client";
import Link from "next/link";

type TxCategory = { id: string; name: string; emoji: string; color: string };
type Tx = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  note: string;
  date: string;
  category: TxCategory;
};
type CatStat = { name: string; emoji: string; color: string; total: number; pct: number };

type Props = {
  transactions: Tx[];
  income: number;
  expense: number;
  balance: number;
  categories: CatStat[];
  month: number;
  year: number;
  monthList: { month: number; year: number }[];
};

const MONTH_NAMES = [
  "Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
  "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12",
];

const CIRC = 2 * Math.PI * 52;

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M đ";
  if (n >= 1_000) return Math.round(n / 1_000) + "K đ";
  return n.toLocaleString("vi-VN") + "đ";
}

function fmtFull(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function groupByDay(txs: Tx[]) {
  const map = new Map<string, { label: string; items: Tx[] }>();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  for (const tx of txs) {
    const d = new Date(tx.date);
    const key = d.toDateString();
    if (!map.has(key)) {
      const dd = pad2(d.getDate());
      const mm = pad2(d.getMonth() + 1);
      let label: string;
      if (key === today.toDateString()) label = `HÔM NAY — ${dd}/${mm}`;
      else if (key === yesterday.toDateString()) label = `HÔM QUA — ${dd}/${mm}`;
      else label = `${dd}/${mm}/${d.getFullYear()}`;
      map.set(key, { label, items: [] });
    }
    map.get(key)!.items.push(tx);
  }
  return Array.from(map.values());
}

function buildArcs(cats: CatStat[]) {
  let cumulative = 0;
  return cats.slice(0, 5).map((c) => {
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

function MonthTabs({ monthList, month, year }: Pick<Props, "monthList" | "month" | "year">) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        paddingBottom: 2,
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
      } as React.CSSProperties}
    >
      {monthList.map((m) => {
        const active = m.month === month && m.year === year;
        return (
          <Link
            key={`${m.month}-${m.year}`}
            href={`/transactions?month=${m.month}&year=${m.year}`}
            style={{
              flexShrink: 0,
              padding: "8px 18px",
              background: active
                ? "linear-gradient(135deg,#7B6EF6,#2DD4BF)"
                : "rgba(255,255,255,.05)",
              border: active ? "none" : "1px solid rgba(255,255,255,.07)",
              borderRadius: 10,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <span style={{ color: active ? "#fff" : "#4A5568", fontSize: 13, fontWeight: active ? 600 : 400 }}>
              {MONTH_NAMES[m.month - 1]}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function EmptyState({ month, year }: { month: number; year: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px", gap: 12 }}>
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 20,
          background: "rgba(255,255,255,.04)",
          border: "1px solid rgba(255,255,255,.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
        }}
      >
        📭
      </div>
      <p style={{ color: "#C8D3E0", fontSize: 14, fontWeight: 600 }}>Không có giao dịch</p>
      <p style={{ color: "#334155", fontSize: 12, textAlign: "center" }}>
        {MONTH_NAMES[month - 1]}/{year} chưa có giao dịch nào.
      </p>
      <Link
        href={`/add?month=${month}&year=${year}`}
        style={{
          marginTop: 4,
          padding: "10px 20px",
          background: "linear-gradient(135deg,#7B6EF6,#2DD4BF)",
          borderRadius: 10,
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        + Thêm giao dịch
      </Link>
    </div>
  );
}

function MobileTransactions({ transactions, income: _i, expense: _e, balance: _b, categories: _c, month, year, monthList }: Props) {
  const groups = groupByDay(transactions);

  return (
    <div style={{ background: "#0B0F1E", minHeight: "100%" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "#0B0F1E",
          marginTop: "calc(-1 * env(safe-area-inset-top, 0px))",
          padding: "calc(env(safe-area-inset-top, 0px) + 8px) 24px 14px",
          borderBottom: "1px solid rgba(255,255,255,.05)",
        }}
      >
        <div style={{ marginBottom: 14 }}>
          <span style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 800 }}>Giao dịch</span>
        </div>
        <MonthTabs monthList={monthList} month={month} year={year} />
      </div>

      {groups.length === 0 ? (
        <EmptyState month={month} year={year} />
      ) : (
        <div style={{ padding: "12px 24px 0" }}>
          {groups.map((group) => (
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
                {group.items.map((tx, i) => {
                  const isExpense = tx.type === "EXPENSE";
                  const d = new Date(tx.date);
                  const time = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                  return (
                    <div
                      key={tx.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 0",
                        borderBottom: i < group.items.length - 1 ? "1px solid rgba(255,255,255,.04)" : undefined,
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 13,
                          background: isExpense ? "rgba(248,113,113,.12)" : "rgba(45,212,191,.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                      >
                        {tx.category.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            color: "#C8D3E0",
                            fontSize: 13,
                            fontWeight: 500,
                            marginBottom: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {tx.note || tx.category.name}
                        </p>
                        <p style={{ color: "#334155", fontSize: 11 }}>
                          {tx.category.name} · {time}
                        </p>
                      </div>
                      <span
                        style={{
                          color: isExpense ? "#F87171" : "#2DD4BF",
                          fontSize: 13,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {isExpense ? "−" : "+"}{fmtFull(tx.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DesktopTransactions({ transactions, income, expense, balance, categories, month, year, monthList }: Props) {
  const arcs = buildArcs(categories);

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Main */}
      <div
        style={{
          flex: 1,
          padding: "22px 24px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 12 }}>
          <div style={{ flexShrink: 0 }}>
            <h2 style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 800, marginBottom: 2 }}>Giao dịch</h2>
            <p style={{ color: "#3D4B60", fontSize: 12 }}>
              {MONTH_NAMES[month - 1]}/{year} · {transactions.length} giao dịch
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <MonthTabs monthList={monthList} month={month} year={year} />
            <Link
              href={`/add?month=${month}&year=${year}`}
              style={{
                padding: "8px 16px",
                background: "linear-gradient(135deg,#7B6EF6,#2DD4BF)",
                borderRadius: 9,
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>+ Thêm mới</span>
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexShrink: 0 }}>
          {[
            { label: "Thu nhập", value: fmtFull(income), color: "#2DD4BF", prefix: "+" },
            { label: "Chi tiêu", value: fmtFull(expense), color: "#F87171", prefix: "−" },
            {
              label: "Tiết kiệm",
              value: fmtFull(Math.abs(balance)),
              color: balance >= 0 ? "#7B6EF6" : "#F87171",
              prefix: balance >= 0 ? "+" : "−",
            },
            { label: "Giao dịch", value: String(transactions.length), color: "#E2E8F0", prefix: "" },
          ].map((stat) => (
            <div key={stat.label} style={{ flex: 1, padding: "12px 14px", background: "#141C30", borderRadius: 12 }}>
              <p style={{ color: "#2D3B55", fontSize: 10, marginBottom: 3 }}>{stat.label}</p>
              <p style={{ color: stat.color, fontSize: 16, fontWeight: 800 }}>
                {stat.prefix}{stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        {transactions.length === 0 ? (
          <EmptyState month={month} year={year} />
        ) : (
          <>
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
            <div style={{ flex: 1, overflowY: "auto" }}>
              {transactions.map((tx) => {
                const isExpense = tx.type === "EXPENSE";
                const d = new Date(tx.date);
                const dateStr = `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
                const timeStr = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                return (
                  <div
                    key={tx.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "11px 14px",
                      borderBottom: "1px solid rgba(255,255,255,.025)",
                      background: !isExpense ? "rgba(45,212,191,.025)" : undefined,
                    }}
                  >
                    <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          background: isExpense ? "rgba(248,113,113,.1)" : "rgba(45,212,191,.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 15,
                          flexShrink: 0,
                        }}
                      >
                        {tx.category.emoji}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            color: "#C8D3E0",
                            fontSize: 13,
                            fontWeight: 500,
                            marginBottom: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {tx.note || tx.category.name}
                        </p>
                        <p style={{ color: "#2D3B55", fontSize: 11 }}>{timeStr}</p>
                      </div>
                    </div>
                    <span style={{ flex: 1, color: "#4A5568", fontSize: 12 }}>{tx.category.name}</span>
                    <span style={{ flex: 1, color: "#4A5568", fontSize: 12 }}>{dateStr}</span>
                    <span
                      style={{
                        flex: 1,
                        color: isExpense ? "#F87171" : "#2DD4BF",
                        fontSize: 13,
                        fontWeight: 600,
                        textAlign: "right",
                      }}
                    >
                      {isExpense ? "−" : "+"}{fmtFull(tx.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
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
        <h3 style={{ color: "#E2E8F0", fontSize: 15, fontWeight: 700 }}>
          Phân tích {MONTH_NAMES[month - 1]}
        </h3>

        {/* Donut chart */}
        <div style={{ background: "#141C30", borderRadius: 16, padding: 14, display: "flex", justifyContent: "center" }}>
          {categories.length === 0 ? (
            <div style={{ height: 134, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 28 }}>📊</span>
              <p style={{ color: "#334155", fontSize: 12 }}>Chưa có dữ liệu</p>
            </div>
          ) : (
            <svg viewBox="0 0 160 160" width="134" height="134">
              <circle cx="80" cy="80" r="52" fill="none" stroke="#0B0F1E" strokeWidth="20" />
              {arcs.map((arc, i) => (
                <circle
                  key={i}
                  cx="80"
                  cy="80"
                  r="52"
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="20"
                  strokeDasharray={arc.dashArray}
                  strokeDashoffset={arc.dashOffset}
                  transform="rotate(-90 80 80)"
                />
              ))}
              <text x="80" y="76" textAnchor="middle" fill="#E2E8F0" fontSize="12" fontWeight="700" fontFamily="inherit">
                {fmt(expense)}
              </text>
              <text x="80" y="91" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="inherit">
                chi tiêu
              </text>
            </svg>
          )}
        </div>

        {/* Category legend */}
        {categories.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {categories.slice(0, 5).map((cat) => (
              <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{cat.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ color: "#C8D3E0", fontSize: 12, fontWeight: 500 }}>{cat.name}</span>
                    <span style={{ color: "#94A3B8", fontSize: 11, fontWeight: 700 }}>
                      {cat.pct}% · {fmt(cat.total)}
                    </span>
                  </div>
                  <div style={{ height: 3, background: "#0B0F1E", borderRadius: 2 }}>
                    <div style={{ width: `${cat.pct}%`, height: "100%", background: cat.color, borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Income summary */}
        {(income > 0 || expense > 0) && (
          <div style={{ background: "#141C30", borderRadius: 14, padding: 14 }}>
            <p style={{ color: "#94A3B8", fontSize: 11, fontWeight: 600, letterSpacing: ".04em", marginBottom: 10 }}>
              TỔNG KẾT THÁNG
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {income > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B", fontSize: 12 }}>Thu nhập</span>
                  <span style={{ color: "#2DD4BF", fontSize: 12, fontWeight: 600 }}>+{fmtFull(income)}</span>
                </div>
              )}
              {expense > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B", fontSize: 12 }}>Chi tiêu</span>
                  <span style={{ color: "#F87171", fontSize: 12, fontWeight: 600 }}>−{fmtFull(expense)}</span>
                </div>
              )}
              <div style={{ height: 1, background: "rgba(255,255,255,.05)", margin: "2px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600 }}>Tiết kiệm</span>
                <span
                  style={{
                    color: balance >= 0 ? "#7B6EF6" : "#F87171",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  {balance >= 0 ? "+" : "−"}{fmtFull(Math.abs(balance))}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Transactions(props: Props) {
  return (
    <>
      <div className="lg:hidden">
        <MobileTransactions {...props} />
      </div>
      <div className="hidden lg:flex h-full">
        <DesktopTransactions {...props} />
      </div>
    </>
  );
}
