import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "neutral-200": "#e5e5e5",
        "neutral-300": "#d4d4d4",
        "neutral-400": "#a1a1a1",
        "neutral-500": "#737373",
        "neutral-600": "#525252",
        "neutral-900": "#171717",
        "sapphire-300": "#1B4F9E",
        "sapphire-400": "#0F52BA",
        "emerald-600": "#009767",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.625rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
      },
      spacing: {
        "spacing-unit": "0.25rem",
      },
      lineHeight: {
        relaxed: "1.625",
      },
      letterSpacing: {
        tight: "-0.025em",
      },
      fontWeight: {
        semibold: "600",
        extrabold: "800",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      transitionDuration: {
        DEFAULT: "0.15s",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
