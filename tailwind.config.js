/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kazakh: {
          blue: '#00A3E0',     // Kazakh Flag Cyan-Blue
          blueDark: '#0077B6', // Deep Sky Blue
          gold: '#FFC72C',     // Kazakh Flag Sun & Eagle Gold
          goldDark: '#D97706', // Rich Warm Gold
          bg: '#F8FAFC',       // Clean White/Light BG
          card: '#FFFFFF',     // Crisp White Card
        },
        zhuz: {
          uly: '#00A3E0',    // Ұлы жүз - Sky Blue
          orta: '#0284C7',   // Орта жүз - Deep Cyan
          kishi: '#EAB308',  // Кіші жүз - Gold
          other: '#8B5CF6',  // Жүзден тыс - Purple
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'kazakh-glow': '0 0 25px rgba(0, 163, 224, 0.3)',
        'gold-glow': '0 0 25px rgba(255, 199, 44, 0.4)',
        'apple-card': '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '40px',
      },
    },
  },
  plugins: [],
}
