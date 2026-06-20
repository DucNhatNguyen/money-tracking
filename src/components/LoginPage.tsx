"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0B0F1E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 13,
            background: "linear-gradient(135deg,#7B6EF6,#2DD4BF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>F</span>
        </div>
        <div>
          <p style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 800, lineHeight: 1.1 }}>FinFamily</p>
          <p style={{ color: "#64748B", fontSize: 12, fontWeight: 500 }}>Quản lý tài chính gia đình</p>
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#0D1322",
          border: "1px solid rgba(255,255,255,.07)",
          borderRadius: 20,
          padding: "28px 24px 24px",
          boxShadow: "0 24px 64px rgba(0,0,0,.5)",
        }}
      >
        <h1 style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Đăng nhập</h1>
        <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>Chào mừng bạn quay lại!</p>

        <form action={action} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Username */}
          <div>
            <label style={{ display: "block", color: "#94A3B8", fontSize: 12, fontWeight: 600, letterSpacing: ".04em", marginBottom: 6 }}>
              TÊN ĐĂNG NHẬP
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", lineHeight: 0, pointerEvents: "none" }}>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#3D4B60" strokeWidth="1.5">
                  <circle cx="10" cy="7" r="3.5" />
                  <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" strokeLinecap="round" />
                </svg>
              </span>
              <input
                name="username"
                type="text"
                placeholder="Tên đăng nhập hoặc email"
                autoComplete="username"
                required
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 10,
                  padding: "11px 12px 11px 38px",
                  color: "#E2E8F0",
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", color: "#94A3B8", fontSize: 12, fontWeight: 600, letterSpacing: ".04em", marginBottom: 6 }}>
              MẬT KHẨU
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", lineHeight: 0, pointerEvents: "none" }}>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#3D4B60" strokeWidth="1.5">
                  <rect x="4" y="9" width="12" height="8" rx="2" />
                  <path d="M7 9V6a3 3 0 016 0v3" strokeLinecap="round" />
                </svg>
              </span>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                required
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 10,
                  padding: "11px 42px 11px 38px",
                  color: "#E2E8F0",
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", lineHeight: 0, padding: 2 }}
              >
                {showPassword ? (
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#64748B" strokeWidth="1.5">
                    <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" /><circle cx="10" cy="10" r="2.5" />
                    <line x1="3" y1="3" x2="17" y2="17" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#64748B" strokeWidth="1.5">
                    <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" /><circle cx="10" cy="10" r="2.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {state?.error && (
            <div style={{ background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)", borderRadius: 8, padding: "9px 12px", color: "#F87171", fontSize: 13 }}>
              {state.error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            style={{
              marginTop: 4,
              padding: "13px 0",
              borderRadius: 12,
              background: isPending ? "rgba(123,110,246,.4)" : "linear-gradient(135deg,#7B6EF6,#5B8DEF)",
              border: "none",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: isPending ? "default" : "pointer",
              fontFamily: "inherit",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.07)" }} />
          <span style={{ color: "#3D4B60", fontSize: 12, fontWeight: 500 }}>hoặc</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.07)" }} />
        </div>

        {/* Register link */}
        <p style={{ textAlign: "center", color: "#64748B", fontSize: 13, marginBottom: 16 }}>
          Chưa có tài khoản?{" "}
          <Link href="/register" style={{ color: "#7B6EF6", fontWeight: 600, textDecoration: "none" }}>
            Đăng ký ngay
          </Link>
        </p>

        {/* Gmail — coming soon */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            disabled
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 12,
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.07)",
              color: "#4A5568",
              fontSize: 14,
              fontWeight: 600,
              cursor: "not-allowed",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4A5568" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#3D4B60" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#3A4455" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#3D4B60" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Tiếp tục với Gmail
          </button>
          <span style={{ position: "absolute", top: -8, right: 12, background: "rgba(123,110,246,.15)", border: "1px solid rgba(123,110,246,.25)", borderRadius: 6, padding: "2px 7px", fontSize: 10, fontWeight: 700, color: "#7B6EF6", letterSpacing: ".04em" }}>
            SẮP RA MẮT
          </span>
        </div>
      </div>

      <p style={{ color: "#2D3B55", fontSize: 12, marginTop: 24, textAlign: "center" }}>
        FinFamily © 2025 · Quản lý tài chính gia đình
      </p>
    </div>
  );
}
