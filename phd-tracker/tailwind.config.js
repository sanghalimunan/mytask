/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf2f4',
          100: '#fbe4e8',
          200: '#f5c1cb',
          300: '#ec97a8',
          400: '#e0637f',
          500: '#c41e3a',
          600: '#a8172f',
          700: '#861226',
          800: '#640e1c',
          900: '#420913',
        },
      },
    },
  },
  plugins: [],
}
