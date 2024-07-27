/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '*',
    './views/**/*.{html,hbs}', // Ajusta el path según la ubicación de tus plantillas
    './src/**/*.{ts,html}',    // Asegúrate de que también se incluyan archivos TS si estás usando views en componentes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};