"use client";
import { useState } from "react";
import Avatar from "./Avatar";
import { getAvatarColor } from "@/lib/avatars";
import type { StoreUser } from "@/lib/types";
import { tw } from "@/lib/theme";
import * as Icons from "./Icons";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (user: StoreUser) => void;
  onLogout?: () => void;
  user?: StoreUser | null;
}

export default function LoginModal({ open, onClose, onSuccess, onLogout, user }: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();

  if (!open) return null;

  const displayName = form.name || user?.name || "Guest";
  const headerAvatarColor = getAvatarColor(displayName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      const signedInUser: StoreUser = {
        name: mode === "register" ? form.name : (form.email.split("@")[0] || "User"),
        email: form.email,
        avatarUrl: avatarPreview,
      };
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.(signedInUser);
        onClose();
        setForm({ name: "", email: "", phone: "", password: "" });
        setAvatarPreview(undefined);
        setMode("login");
      }, 1400);
    }, 1200);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 500,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, animation: "fadeIn 0.25s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 28, width: "100%", maxWidth: 440,
          overflow: "hidden", animation: "fadeUp 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header with avatar */}
        <div style={{
          background: "linear-gradient(135deg, #1A1208 0%, #3C2A0A 50%, #C89B3C 100%)",
          padding: "28px 32px 24px",
          position: "relative",
          textAlign: "center",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <Avatar
                name={displayName}
                size={72}
                color={headerAvatarColor}
                imageUrl={avatarPreview || user?.avatarUrl}
                className="border-[3px] border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
              />
              {mode === "register" && (
                <label
                  htmlFor="avatar-upload"
                  style={{
                    position: "absolute", bottom: -2, right: -2,
                    width: 28, height: 28, borderRadius: 14,
                    background: "#C89B3C", border: "2px solid #1A1208",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#fff",
                  }}
                  title="Upload photo"
                >
                  <Icons.Plus />
                  <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
                </label>
              )}
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant', serif", fontSize: 26, fontWeight: 700, color: "#FDFAF4", marginBottom: 4 }}>
                {user && !success ? "My Account" : mode === "login" ? "Welcome Back" : mode === "register" ? "Create Account" : "Reset Password"}
              </div>
              <div style={{ fontSize: 13, color: "rgba(250,250,249,0.6)", fontFamily: "'Inter', sans-serif" }}>
                {user && !success ? "Manage your Skynet store account" : mode === "login" ? "Sign in to your Skynet account" : mode === "register" ? "Join 1,300+ businesses using Skynet" : "We'll send you a reset link"}
              </div>
            </div>
          </div>
        {/* ── Back / Close buttons ─────────────────────────────────────── */}
          {mode === "forgot" && (
            <button
              onClick={() => setMode("login")}
              style={{
                position: "absolute", top: 16, left: 16,
                background: "rgba(255,255,255,0.12)", border: "none", cursor: "pointer",
                width: 36, height: 36, borderRadius: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(250,250,249,0.85)", fontSize: 18, fontFamily: "'Inter', sans-serif",
              }}
              title="Back to Sign In"
            >
              ←
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(255,255,255,0.12)", border: "none", cursor: "pointer",
              width: 36, height: 36, borderRadius: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(250,250,249,0.85)",
            }}
            title="Close"
          >
            <Icons.X />
          </button>
        </div>

        <div style={{ padding: "24px 32px 32px" }}>
          {user && !success ? (
            <div style={{ textAlign: "center" }}>
              <Avatar name={user.name} size={80} imageUrl={user.avatarUrl} className="mx-auto mb-4" />
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1208", fontFamily: "'Cormorant', serif", marginBottom: 4 }}>{user.name}</div>
              <div style={{ fontSize: 13, color: "#7D6E5A", fontFamily: "'Inter', sans-serif", marginBottom: 24 }}>{user.email}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button className={tw.btnPrimary} style={{ width: "100%", justifyContent: "center" }} onClick={onClose}>
                  ← Continue Shopping <Icons.ArrowRight />
                </button>
                <button
                  className={tw.btnOutline}
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => { onLogout?.(); }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : success ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Avatar name={displayName} size={64} color={headerAvatarColor} imageUrl={avatarPreview} className="mx-auto mb-4" />
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1208", fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>
                {mode === "login" ? "Signed in!" : mode === "register" ? "Account created!" : "Email sent!"}
              </div>
              <div style={{ fontSize: 13, color: "#7D6E5A", fontFamily: "'Inter', sans-serif" }}>
                {mode === "forgot" ? "Check your inbox for the reset link." : "Welcome to Skynet Solution Qatar."}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {mode === "register" && (
                  <FormField label="Full Name" icon={<Icons.User />}>
                    <input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Mohammed Al-Thani"
                      required
                      style={inputStyle}
                    />
                  </FormField>
                )}

                <FormField label="Email Address" icon={<Icons.Mail />}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@company.com"
                    required
                    style={inputStyle}
                  />
                </FormField>

                {mode === "register" && (
                  <FormField label="Phone (Qatar)" icon={<Icons.Phone />}>
                    <input
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+974 XXXX XXXX"
                      style={inputStyle}
                    />
                  </FormField>
                )}

                {mode !== "forgot" && (
                  <FormField label="Password" icon={<Icons.Lock />}>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPass ? "text" : "password"}
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        placeholder="••••••••"
                        required
                        style={{ ...inputStyle, paddingRight: 44 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(p => !p)}
                        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7D6E5A", display: "flex" }}
                      >
                        {showPass ? <Icons.EyeOff /> : <Icons.Eye />}
                      </button>
                    </div>
                  </FormField>
                )}

                {mode === "login" && (
                  <div style={{ textAlign: "right", marginTop: -4 }}>
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#C89B3C", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={tw.btnPrimary}
                  style={{ width: "100%", justifyContent: "center", marginTop: 8, fontSize: 15, padding: "15px 20px", opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <span className="spin" style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }} />
                  ) : (
                    <>{mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : "Send Reset Link"} <Icons.ArrowRight /></>
                  )}
                </button>

                {mode !== "forgot" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
                      <div style={{ flex: 1, height: 1, background: "#E8D9B8" }} />
                      <span style={{ fontSize: 12, color: "#9E8E78", fontFamily: "'Inter', sans-serif" }}>or continue with</span>
                      <div style={{ flex: 1, height: 1, background: "#E8D9B8" }} />
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[
                        { label: "Google", bg: "#fff", color: "#44403C", border: "#E8D9B8", icon: "G" },
                        { label: "Microsoft", bg: "#F3F4F6", color: "#1A1208", border: "#D6D3D1", icon: "M" },
                      ].map(({ label, bg, color, border, icon }) => (
                        <button
                          key={label}
                          type="button"
                          style={{
                            flex: 1, padding: "11px 16px", border: `1.5px solid ${border}`, borderRadius: 100,
                            background: bg, cursor: "pointer", fontSize: 13,
                            fontFamily: "'Inter', sans-serif", fontWeight: 600, color,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            transition: "border-color 0.2s, box-shadow 0.2s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#C89B3C"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(59,125,216,0.15)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none"; }}
                        >
                          <span style={{
                            width: 22, height: 22, borderRadius: 11, background: label === "Google" ? "#4285F4" : "#0078D4",
                            color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
                          }}>{icon}</span>
                          {label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <div style={{ textAlign: "center", fontSize: 13, color: "#7D6E5A", fontFamily: "'Inter', sans-serif" }}>
                  {mode === "login" ? (
                    <>Don&apos;t have an account?{" "}
                      <button type="button" onClick={() => setMode("register")} style={{ background: "none", border: "none", cursor: "pointer", color: "#C89B3C", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                        Register
                      </button>
                    </>
                  ) : mode === "register" ? (
                    <>Already have an account?{" "}
                      <button type="button" onClick={() => setMode("login")} style={{ background: "none", border: "none", cursor: "pointer", color: "#C89B3C", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                        Sign In
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setMode("login")} style={{ background: "none", border: "none", cursor: "pointer", color: "#C89B3C", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                      ← Back to Sign In
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px",
  border: "1.5px solid #E8D9B8", borderRadius: 12,
  fontSize: 14, fontFamily: "'Inter', sans-serif", color: "#1A1208",
  background: "#FDFAF4", outline: "none", transition: "border-color 0.2s",
};

function FormField({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#44403C", marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>
        <span style={{ color: "#C89B3C", display: "flex" }}>{icon}</span> {label}
      </label>
      {children}
    </div>
  );
}
