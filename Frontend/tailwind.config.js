import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5", // Indigo
        secondary: "#ec4899", // Pink
        accent: "#22d3ee", // Cyan
        neutral: "#64748b", // Slate
        base: "#f3f4f6", // Gray
        info: "#3b82f6", // Blue
        success: "#10b981", // Green
        warning: "#f59e0b", // Yellow
        error: "#ef4444", // Red
      },
      fontWeight: {
        bold: '700',
        semibold: '600',
        medium: '500',
      },
      borderRadius: {
        'xl': '1rem',
      },
      boxShadow: {
        'custom': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#4f46e5",
          secondary: "#ec4899",
          accent: "#22d3ee",
          neutral: "#64748b",
          "base-100": "#f3f4f6",
          info: "#3b82f6",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
  },
};