/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f3e2e5',     // rosa palo
        accent: '#d4af37',      // dorado
        neutral: '#f5f5f5',     // beige claro
        buttonRed: '#d45b5b',   // rojo rosado
        darkText: '#212121',    // gris muy oscuro para texto principal
        mediumText: '#222325',  // gris medio para descripciones
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Satoshi', 'sans-serif'],
      },
    },
  },
  plugins: [],
}