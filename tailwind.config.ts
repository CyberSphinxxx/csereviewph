import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        highlight: {
          DEFAULT: "var(--highlight)",
          foreground: "var(--highlight-foreground)",
          border: "var(--highlight-border)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        brand: {
          50: "#f8edef", // Approved selected/active porcelain background
          100: "#f2dce1", // Soft porcelain rose blush
          200: "#e5bcc6", // Subtle rose border
          300: "#d396a6", // Soft rose accent
          400: "#de5572", // Readable rose-maroon for dark mode text/accents
          500: "#9c223d", // Medium rich maroon
          600: "#86152d", // Approved primary brand / actions
          700: "#86152d", // Unified action color across buttons & links
          800: "#701126", // Approved primary hover
          900: "#4d0c1a", // Deep rich burgundy wine
          950: "#2b060e", // Deepest dark maroon for contrast surfaces
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // Philippine sun gold
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
      },
    },
  },
  plugins: [],
};
export default config;
