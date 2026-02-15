/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f0',
          100: '#ffe4d9',
          200: '#ffc9b3',
          300: '#ffa785',
          400: '#ff8052',
          500: '#ff6b35',
          600: '#f05123',
          700: '#c93f1a',
          800: '#a1351a',
          900: '#84301b',
        },
        secondary: {
          50: '#fef3f2',
          100: '#fde4e2',
          200: '#fcc9c5',
          300: '#f9a5a0',
          400: '#f47872',
          500: '#e95b54',
          600: '#d43b3b',
          700: '#b22e31',
          800: '#94292d',
          900: '#7c272b',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}