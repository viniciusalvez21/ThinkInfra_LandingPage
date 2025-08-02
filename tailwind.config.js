/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Poppins', 'sans-serif'],
        },
        colors: {
          'background': '#0D1117',
          'surface': '#161B22',
          'primary-text': '#CBD5E1', // <-- Cor ajustada aqui
          'secondary-text': '#A0AEC0',
          'accent-blue': '#38BDF8',
          'accent-purple': '#8B5CF6',
        }
      },
    },
    plugins: [],
  }