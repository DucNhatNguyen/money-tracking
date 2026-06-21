export default function DashboardLoading() {
  return (
    <div style={{ background: "#0B0F1E", minHeight: "100dvh" }}>
      {/* Header gradient */}
      <div
        style={{
          background: "linear-gradient(175deg,#170E3F 0%,#0C1835 65%,#0B0F1E 100%)",
          marginTop: "calc(-1 * env(safe-area-inset-top, 0px))",
          padding: "calc(env(safe-area-inset-top, 0px) + 14px) 24px 24px",
        }}
      >
        {/* Greeting row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div className="skeleton" style={{ width: 64, height: 13, marginBottom: 7 }} />
            <div className="skeleton" style={{ width: 130, height: 20 }} />
          </div>
          <div className="skeleton" style={{ width: 38, height: 38, borderRadius: "50%" }} />
        </div>

        {/* Balance card */}
        <div style={{ background: "rgba(255,255,255,.034)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, padding: "18px 20px" }}>
          <div className="skeleton" style={{ width: 90, height: 11, marginBottom: 10 }} />
          <div className="skeleton" style={{ width: 150, height: 30, marginBottom: 14 }} />
          <div style={{ display: "flex", gap: 10 }}>
            <div className="skeleton" style={{ flex: 1, height: 52, borderRadius: 12 }} />
            <div className="skeleton" style={{ flex: 1, height: 52, borderRadius: 12 }} />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding: "14px 24px 8px", display: "flex", justifyContent: "space-between" }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 18 }} />
            <div className="skeleton" style={{ width: 32, height: 11 }} />
          </div>
        ))}
      </div>

      {/* Recent transactions */}
      <div style={{ padding: "8px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <div className="skeleton" style={{ width: 110, height: 14 }} />
          <div className="skeleton" style={{ width: 60, height: 14 }} />
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}
          >
            <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 13, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: "55%", height: 13, marginBottom: 7 }} />
              <div className="skeleton" style={{ width: "35%", height: 11 }} />
            </div>
            <div className="skeleton" style={{ width: 72, height: 16 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
