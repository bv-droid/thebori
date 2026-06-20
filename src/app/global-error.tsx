"use client";

/* Catches errors in the root layout itself — must render its own <html>/<body>. */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          background: "#0c0c0a",
          color: "#e9e7e1",
          fontFamily: "monospace",
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
      </body>
    </html>
  );
}
