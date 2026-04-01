import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        "primary-light": "#3B82F6",
        secondary: "#14B8A6",
        accent: "#F59E0B",
        "neutral-bg": "#F1F5F9",
        "neutral-text": "#1E293B",
        "text-dark": "#0F172A",
        "text-light": "#475569",
        error: "#EF4444",
        success: "#10B981",
        "cool-gray": "#F1F5F9",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
        mono: ["Roboto Mono", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xl: "12px",
      },
    },
  },
  plugins: [],
} satisfies Config;
