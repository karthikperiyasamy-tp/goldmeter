import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#d4af37",
        charcoal: "#1f1f2b",
        sand: "#fff8eb",
        amber: {
          450: "#f7b948",
        },
      },
      boxShadow: {
        soft: "0 10px 40px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;

