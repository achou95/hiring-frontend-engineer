/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'light-blue': 'rgba(9, 129, 195, 1)',
      },
    },
  },
  plugins: [],
};
