import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "var(--surface)",
        card: "var(--card)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        tertiary: "var(--tertiary)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        inset: "var(--inset)",
        line: "var(--line)",
        income: "var(--income)",
        expense: "var(--expense)",
        warning: "var(--warning)",
        "on-primary": "var(--on-primary)",
      },
      borderRadius: {
        lg: "1rem",
        xl: "1.5rem",
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "Outfit", "sans-serif"],
        manrope: ["var(--font-manrope)", "Manrope", "sans-serif"],
      },
      boxShadow: {
        cloud:
          "0px 4px 16px -2px rgba(var(--shadow-rgb), 0.18), 0px 1px 2px rgba(46, 42, 54, 0.04)",
        float: "0px 12px 28px -4px rgba(var(--shadow-rgb), 0.32)",
        press: "0px 4px 12px rgba(var(--shadow-rgb), 0.4)",
      },
      maxWidth: {
        dashboard: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
