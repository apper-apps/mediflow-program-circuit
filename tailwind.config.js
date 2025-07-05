/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F4FD',
          100: '#D1E9FB',
          200: '#A3D3F7',
          300: '#75BDF3',
          400: '#47A7EF',
          500: '#0077B6',
          600: '#006BA3',
          700: '#005F91',
          800: '#00537E',
          900: '#00476B'
        },
        secondary: {
          50: '#E6F8FC',
          100: '#CCF1F9',
          200: '#99E3F3',
          300: '#66D5ED',
          400: '#33C7E7',
          500: '#00B4D8',
          600: '#00A3C3',
          700: '#0092AE',
          800: '#008199',
          900: '#007084'
        },
        accent: {
          50: '#F0FCFE',
          100: '#E1F9FD',
          200: '#C3F3FB',
          300: '#A5EDF9',
          400: '#87E7F7',
          500: '#90E0EF',
          600: '#82CAD6',
          700: '#74B4BD',
          800: '#669EA4',
          900: '#58888B'
        },
        surface: '#F8FBFD',
        success: '#06D6A0',
        warning: '#FFB700',
        error: '#EF476F',
        info: '#118AB2'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}