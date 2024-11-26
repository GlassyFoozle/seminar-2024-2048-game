/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tile: {
          2: '#e0f7fa',
          4: '#b2ebf2',
          8: '#80deea',
          16: '#26c6da',
          32: '#00acc1',
          64: '#00838f',
          128: '#006064',
          null: '#cccccc',
        },
        green: '#00796b',
        darkgreen: '#004d40',
      },
    },
  },
  plugins: [],
}

