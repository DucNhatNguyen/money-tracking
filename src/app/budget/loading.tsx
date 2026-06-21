export default function BudgetLoading() {
  return (
    <div style={{ background: "#0B0F1E", minHeight: "100dvh", padding: "22px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 100, height: 22 }} />
        <div className="skeleton" style={{ width: 110, height: 36, borderRadius: 10 }} />
      </div>

      {/* Month nav */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 110, height: 32, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
      </div>

      {/* Overall summary */}
      <div className="skeleton" style={{ height: 90, borderRadius: 16, marginBottom: 20 }} />

      {/* Budget items */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 14,
            padding: 14,
            marginBottom: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 10 }} />
              <div className="skeleton" style={{ width: 80, height: 14 }} />
            </div>
            <div className="skeleton" style={{ width: 70, height: 14 }} />
          </div>
          <div className="skeleton" style={{ height: 6, borderRadius: 3 }} />
        </div>
      ))}
    </div>
  );
}
