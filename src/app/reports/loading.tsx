export default function ReportsLoading() {
  return (
    <div style={{ background: "#0B0F1E", minHeight: "100dvh", padding: "22px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div className="skeleton" style={{ width: 80, height: 22 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <div className="skeleton" style={{ width: 80, height: 32, borderRadius: 8 }} />
          <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div className="skeleton" style={{ flex: 1, height: 72, borderRadius: 16 }} />
        <div className="skeleton" style={{ flex: 1, height: 72, borderRadius: 16 }} />
      </div>

      {/* Chart placeholder */}
      <div className="skeleton" style={{ height: 200, borderRadius: 16, marginBottom: 24 }} />

      {/* Category breakdown label */}
      <div className="skeleton" style={{ width: 130, height: 13, marginBottom: 16 }} />

      {/* Category rows */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 8 }} />
              <div className="skeleton" style={{ width: 80, height: 13 }} />
            </div>
            <div className="skeleton" style={{ width: 60, height: 13 }} />
          </div>
          <div className="skeleton" style={{ height: 6, borderRadius: 3 }} />
        </div>
      ))}
    </div>
  );
}
