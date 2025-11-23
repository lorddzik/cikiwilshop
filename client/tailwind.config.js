// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      'primary': '#F4C430', // Yellow as primary
      'secondary': '#FFFFFF', // White as secondary
      'background': '#FFFFFF',
      'primary-yellow': '#F4C430',
      'primary-gray': '#A3A3A3',
      'primary-text': '#000000',
      'accent': '#F4C430', // Yellow accent
    }
  },
},
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
