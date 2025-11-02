/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',    // Extra small devices
        'sm': '640px',    // Small devices (default)
        'md': '768px',    // Medium devices (default)
        'lg': '1024px',   // Large devices (default)
        'xl': '1280px',   // Extra large devices (default)
        '2xl': '1536px',  // 2X large devices (default)
        '3xl': '1920px',  // 3X large devices (ultra-wide)
      },
      spacing: {
        '4.5': '1.125rem',   // 18px
        '5.5': '1.375rem',   // 22px
        '18': '4.5rem',      // 72px
      },
    },
  },
  plugins: [],
}
