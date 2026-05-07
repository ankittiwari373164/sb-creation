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
          50: '#fef5f0',
          100: '#fde8dd',
          200: '#f8c8dc', // Blush Pink
          300: '#f5b8cf',
          400: '#f3a8c2',
          500: '#f098b5',
          600: '#ed88a8',
          700: '#ea789b',
          800: '#e7688e',
          900: '#e45881',
        },
        secondary: {
          50: '#fefcf7',
          100: '#fdf8f0',
          200: '#f5e9dc', // Champagne Beige
          300: '#ede0ce',
          400: '#e5d7c0',
          500: '#dcceb2',
          600: '#d4c5a4',
          700: '#ccbc96',
          800: '#c4b388',
          900: '#bca97a',
        },
        accent: {
          gold: '#D4AF37', // Gold
          ivory: '#FFFFF0', // Ivory
          charcoal: '#2d2416', // Dark Brown for text
          silk: '#F5E9DC', // Champagne Beige as base
          blue: '#0F5A7E', // Logo Blue
          blush: '#F8C8DC', // Blush Pink
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Poppins', 'Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}