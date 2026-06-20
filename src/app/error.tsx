"use client";

/* Route-level error boundary — a render throw degrades to a branded fallback
   with a retry instead of a blank screen (e.g. WebGL unavailable on low-end
   devices). */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        background:
          "radial-gradient(120% 95% at 50% 40%, #46443e 0%, #322f29 46%, #16140f 100%)",
        color: "#e9e7e1",
        fontFamily: "var(--ff-mono, monospace)",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div style={{ fontSize: "1.6rem", letterSpacing: "0.08em" }}>BØRI</div>
      <div
        style={{
          fontSize: "0.8rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(233,231,225,0.6)",
        }}
      >
        Сигнал потерян
      </div>
      <button
        type="button"
        onClick={reset}
        style={{
          marginTop: 8,
          fontFamily: "inherit",
          fontSize: "0.74rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#0c0c0a",
          background: "#a8b0b8",
          border: "none",
          borderRadius: 3,
          padding: "14px 26px",
          cursor: "pointer",
        }}
      >
        Повторить
      </button>
    </div>
  );
}
