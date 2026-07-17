/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Mirrors the VS Code theme via CSS vars so Beacon never fights the
        // user's chosen dark theme - it's a native panel, not a themed app.
        panel: "var(--vscode-editor-background)",
        border: "var(--vscode-widget-border, #2a2a2a)",
        accent: "var(--vscode-focusBorder, #3b82f6)",
        muted: "var(--vscode-descriptionForeground, #8a8a8a)",
      },
      fontFamily: {
        mono: ["var(--vscode-editor-font-family)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
