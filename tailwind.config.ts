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
                background: "#894d39", // Fallback / Base color
                foreground: "var(--foreground)",
                mandiPrimary: "#894d39",
                mandiSecondary: "#5a542f",
            },
            fontFamily: {
                sans: ["var(--font-sans)", "Helvetica", "Arial", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
