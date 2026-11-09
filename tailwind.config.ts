import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F7F7F5",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#18243A",
          hover: "#253652",
        },
        gold: {
          DEFAULT: "#B89A62",
          light: "#E8DCC4",
        },
        ink: {
          DEFAULT: "#202939",
          secondary: "#77808D",
        },
        border: "#E8E9EC",
        success: "#398568",
        danger: "#C45B5B",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(24, 36, 58, 0.04), 0 2px 8px rgba(24, 36, 58, 0.04)",
        "card-hover": "0 6px 18px rgba(24, 36, 58, 0.08), 0 2px 6px rgba(24, 36, 58, 0.05)",
      },
      spacing: {
        "18": "4.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
