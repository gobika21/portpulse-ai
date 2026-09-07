import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#050B16",
        surface: "#0D1626",
        sunken: "#0A1220",
        border: {
          DEFAULT: "#1E2C42",
          strong: "#2C3F5C",
        },
        ink: {
          DEFAULT: "#EAF2FA",
          muted: "#93A8C2",
          faint: "#5A7290",
        },
        accent: {
          DEFAULT: "#2DD4CB",
          hover: "#5CE4DC",
          soft: "rgba(45, 212, 203, 0.14)",
        },
        tier: {
          low: "#34D399",
          lowSoft: "rgba(52, 211, 153, 0.14)",
          medium: "#FBBF24",
          mediumSoft: "rgba(251, 191, 36, 0.14)",
          high: "#FB923C",
          highSoft: "rgba(251, 146, 60, 0.14)",
          critical: "#F87171",
          criticalSoft: "rgba(248, 113, 113, 0.14)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0, 0, 0, 0.24), 0 1px 1px rgba(0, 0, 0, 0.18)",
        raised: "0 8px 28px rgba(0, 0, 0, 0.4)",
      },
      maxWidth: {
        page: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
