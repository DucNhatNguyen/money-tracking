export default function TransactionsLoading() {
  return (
    <div style={{ background: "#0B0F1E", minHeight: "100dvh", padding: "22px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div className="skeleton" style={{ width: 100, height: 22, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: 160, height: 13 }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ width: 50, height: 32, borderRadius: 8 }} />
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div className="skeleton" style={{ flex: 1, height: 60, borderRadius: 14 }} />
        <div className="skeleton" style={{ flex: 1, height: 60, borderRadius: 14 }} />
        <div className="skeleton" style={{ flex: 1, height: 60, borderRadius: 14 }} />
      </div>

      {/* Transaction list */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}
        >
          <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 13, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: "50%", height: 13, marginBottom: 7 }} />
            <div className="skeleton" style={{ width: "30%", height: 11 }} />
          </div>
          <div className="skeleton" style={{ width: 80, height: 16 }} />
        </div>
      ))}
    </div>
  );
}
