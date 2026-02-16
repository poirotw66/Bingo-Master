/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.{ts,tsx}', './components/**/*.tsx', './hooks/**/*.ts', './types.ts'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bingo: {
          b: '#ef4444',
          i: '#3b82f6',
          n: '#22c55e',
          g: '#eab308',
          o: '#a855f7',
        },
      },
      animation: {
        'pop-in': 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'bounce-small': 'bounceSmall 1s infinite',
      },
      keyframes: {
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSmall: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5%)' },
        },
      },
    },
  },
  plugins: [],
};
