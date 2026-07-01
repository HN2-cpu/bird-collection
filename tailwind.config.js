/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bird-primary': '#2563eb',
        'bird-secondary': '#1e40af',
        'bird-accent': '#f59e0b',
        'bird-green': '#16a34a',
        'bird-bg': '#f8fafc',
      }
    },
  },
  plugins: [],
}
