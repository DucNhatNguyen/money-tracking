"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";

const inputStyle = (paddingLeft = 38): React.CSSProperties => ({
  width: "100%",
  background: "rgba(255,255,255,.04)",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 10,
  padding: `11px 12px 11px ${paddingLeft}px`,
  color: "#E2E8F0",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
});

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#94A3B8",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: ".04em",
  marginBottom: 6,
};

const iconWrap: React.CSSProperties = {
  position: "absolute",
  left: 12,
  top: "50%",
  transform: "translateY(-50%)",
  lineHeight: 0,
  pointerEvents: "none",
};

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(registerAction, null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
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
        <h1 style={{ color: "#E2E8F0", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Tạo tài khoản</h1>
        <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>Tham gia FinFamily và quản lý tài chính ngay!</p>

        <form action={action} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Full name */}
          <div>
            <label style={labelStyle}>TÊN HIỂN THỊ</label>
            <div style={{ position: "relative" }}>
              <span style={iconWrap}>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#3D4B60" strokeWidth="1.5">
                  <circle cx="10" cy="7" r="3.5" />
                  <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" strokeLinecap="round" />
                </svg>
              </span>
              <input
                name="name"
                type="text"
                placeholder="Tên của bạn hoặc gia đình"
                autoComplete="name"
                required
                style={inputStyle()}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label style={labelStyle}>TÊN ĐĂNG NHẬP</label>
            <div style={{ position: "relative" }}>
              <span style={iconWrap}>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#3D4B60" strokeWidth="1.5">
                  <rect x="3" y="3" width="14" height="14" rx="3" />
                  <path d="M7 10h6M10 7v6" strokeLinecap="round" />
                </svg>
              </span>
              <input
                name="username"
                type="text"
                placeholder="3–20 ký tự, chữ thường, số, dấu _"
                autoComplete="username"
                required
                style={inputStyle()}
              />
            </div>
            <p style={{ color: "#3D4B60", fontSize: 11, marginTop: 4 }}>
              Dùng để đăng nhập. Ví dụ: nha_nguyen, family2025
            </p>
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>MẬT KHẨU</label>
            <div style={{ position: "relative" }}>
              <span style={iconWrap}>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#3D4B60" strokeWidth="1.5">
                  <rect x="4" y="9" width="12" height="8" rx="2" />
                  <path d="M7 9V6a3 3 0 016 0v3" strokeLinecap="round" />
                </svg>
              </span>
              <input
                name="password"
                type={showPwd ? "text" : "password"}
                placeholder="Ít nhất 8 ký tự"
                autoComplete="new-password"
                required
                style={inputStyle(38)}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", lineHeight: 0, padding: 2 }}
              >
                <EyeIcon open={showPwd} />
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label style={labelStyle}>XÁC NHẬN MẬT KHẨU</label>
            <div style={{ position: "relative" }}>
              <span style={iconWrap}>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#3D4B60" strokeWidth="1.5">
                  <rect x="4" y="9" width="12" height="8" rx="2" />
                  <path d="M7 9V6a3 3 0 016 0v3" strokeLinecap="round" />
                  <path d="M8 13.5l1.5 1.5 3-3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                required
                style={inputStyle(38)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", lineHeight: 0, padding: 2 }}
              >
                <EyeIcon open={showConfirm} />
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
            {isPending ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>
        </form>

        {/* Footer link */}
        <p style={{ textAlign: "center", color: "#64748B", fontSize: 13, marginTop: 20 }}>
          Đã có tài khoản?{" "}
          <Link href="/login" style={{ color: "#7B6EF6", fontWeight: 600, textDecoration: "none" }}>
            Đăng nhập
          </Link>
        </p>
      </div>

      <p style={{ color: "#2D3B55", fontSize: 12, marginTop: 24, textAlign: "center" }}>
        FinFamily © 2025 · Quản lý tài chính gia đình
      </p>
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#64748B" strokeWidth="1.5">
      <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
      <circle cx="10" cy="10" r="2.5" />
      <line x1="3" y1="3" x2="17" y2="17" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#64748B" strokeWidth="1.5">
      <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
      <circle cx="10" cy="10" r="2.5" />
    </svg>
  );
}
