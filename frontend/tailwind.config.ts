import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFAF9",
        surface: "#FFFFFF",
        sunken: "#F4F4F3",
        border: {
          DEFAULT: "#E5E5E3",
          strong: "#D4D4D1",
        },
        ink: {
          DEFAULT: "#18181B",
          muted: "#52525B",
          faint: "#A1A1AA",
        },
        accent: {
          DEFAULT: "#1D4E89",
          hover: "#173F6E",
          soft: "#EAF1F8",
        },
        tier: {
          low: "#1E7B4D",
          lowSoft: "#E8F5EE",
          medium: "#9A6B00",
          mediumSoft: "#FBF1DC",
          high: "#B5540A",
          highSoft: "#FCEEE0",
          critical: "#B3261E",
          criticalSoft: "#FBE9E8",
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
        card: "0 1px 2px rgba(24, 24, 27, 0.04), 0 1px 1px rgba(24, 24, 27, 0.03)",
        raised: "0 4px 16px rgba(24, 24, 27, 0.08)",
      },
      maxWidth: {
        page: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
