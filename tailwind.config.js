/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  safelist: [
    "line-through",
    "bg-white",
    "bg-blue-50",
    "bg-yellow-50",
    "bg-green-50",
    "dark:bg-gray-700",
    "dark:bg-blue-900/30",
    "dark:bg-yellow-900/30",
    "dark:bg-green-900/30",
  ],

  plugins: [],
};
