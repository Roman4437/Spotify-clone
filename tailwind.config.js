/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        grow: {
          '0%': {
            marginLeft: '-16px',
            width: '72px'
          },
          '100%': {
            marginLeft: '8px',
            width: '144px'
          }
        }
      },
      animation: {
        grow: 'grow 200ms ease-in'
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true })
  ]
}
