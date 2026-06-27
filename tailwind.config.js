/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Outfit", "sans-serif"],
        Satoshi: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
