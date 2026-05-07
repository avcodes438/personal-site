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
        navy: {
          darkest: "#050914",
          dark: "#0A1628",
          DEFAULT: "#112240",
          light: "#1D3461",
        },
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8C97A",
          dark: "#A07830",
        },
        teal: {
          DEFAULT: "#64FFDA",
          dim: "#4AC8B0",
        },
        slate: {
          muted: "#8892B0",
          light: "#CCD6F6",
          lightest: "#E6F1FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "gradient": "gradientShift 8s ease infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
