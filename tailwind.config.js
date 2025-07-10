/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Amélioration des contrastes pour l'accessibilité
        blue: {
          500: '#2563eb', // Bleu plus foncé pour un meilleur contraste avec le texte blanc
          600: '#1d4ed8',
        },
        gray: {
          100: '#f3f4f6', // Gris de fond légèrement plus foncé
          400: '#9ca3af', // Gris de texte plus foncé pour un meilleur contraste
          500: '#6b7280', // Gris de texte plus foncé pour un meilleur contraste
        }
      }
    },
  },
  plugins: [],
}
