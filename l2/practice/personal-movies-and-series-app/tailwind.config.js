/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#1c2237',
        secondary: '#f3f3f3',
        danger: '#f00946',
      },
      fontFamily: {
        franklin: ['"Franklin Gothic Medium"', '"Arial Narrow"', 'Arial', 'sans-serif'],
        system: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          '"Fira Sans"',
          '"Droid Sans"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
      screens: {
        xs: '430px',
      },
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [],
};
