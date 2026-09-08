import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#140D08",
        surface: "rgba(36, 24, 16, 0.78)",
        sunken: "rgba(20, 13, 9, 0.55)",
        border: {
          DEFAULT: "rgba(232, 163, 61, 0.18)",
          strong: "rgba(232, 163, 61, 0.34)",
        },
        ink: {
          DEFAULT: "#F7EEE3",
          muted: "#CBB79E",
          faint: "#93816E",
        },
        accent: {
          DEFAULT: "#E8A33D",
          hover: "#F2B65A",
          soft: "rgba(232, 163, 61, 0.16)",
        },
        tier: {
          low: "#4ADE80",
          lowSoft: "rgba(74, 222, 128, 0.16)",
          medium: "#FBBF24",
          mediumSoft: "rgba(251, 191, 36, 0.16)",
          high: "#FB923C",
          highSoft: "rgba(251, 146, 60, 0.16)",
          critical: "#F87171",
          criticalSoft: "rgba(248, 113, 113, 0.16)",
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
        card: "0 1px 2px rgba(0, 0, 0, 0.35), 0 1px 1px rgba(0, 0, 0, 0.28)",
        raised: "0 8px 28px rgba(0, 0, 0, 0.5)",
      },
      maxWidth: {
        page: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
