/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryCardColor: 'rgba(14,20,33,0.7)',
      }
    },
  },
  plugins: [],
}