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
        primary: "rgba(255, 198, 77, 1)",
        "primary-5": "#f1a606",
        "primary-10": "#b0904d",
        green: "rgba(76, 185, 68, 1)",
        red: "rgba(227, 101, 91, 1)",
        "red-85": "#E3655B",
        black: "rgba(0, 0, 0, 1)",
        "black-10": "#0E0D0D",
        white: "rgba(255, 255, 255, 1)",
        "white-85": "rgba(255, 255, 255, 0.85)",
        "white-75": "rgba(255, 255, 255, 0.75)",
        "white-65": "rgba(255, 255, 255, 0.65)",
        "white-55": "rgba(255, 255, 255, 0.55)",
        "white-45": "rgba(255, 255, 255, 0.45)",
        "white-35": "rgba(255, 255, 255, 0.35)",
        "white-25": "rgba(255, 255, 255, 0.25)",
        "white-15": "rgba(255, 255, 255, 0.15)",
        "white-10": "rgba(255, 255, 255, 0.10)",
        "white-5": "rgba(255, 255, 255, 0.05)",
      },
      backgroundColor: {
        coin: "linear-gradient(45deg, black, transparent)",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
export default config;
