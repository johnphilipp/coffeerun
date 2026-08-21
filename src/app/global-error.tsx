"use client";

/**
 * Catches failures in the root layout itself, which error.tsx sits below and
 * therefore can't handle — StoreHydrator throwing during hydration was exactly
 * that shape. Must render its own <html>/<body>, since the layout it replaces
 * is the thing that failed, and so it can't rely on app fonts or CSS.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background: "#111827",
          color: "#f3f4f6",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", margin: 0 }}>coffeerun failed to load</h2>
        <p style={{ maxWidth: "24rem", color: "#d1d5db", margin: 0 }}>
          Something went wrong before the app could start.
        </p>
        {error.digest && (
          <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#6b7280" }}>
            {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            border: "1px solid #4b5563",
            background: "#1f2937",
            color: "#f3f4f6",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
