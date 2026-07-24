/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'moon-bg': '#020617',
        'moon-pane': '#0f172a',
        'moon-border': '#334155',
        'moon-text': '#f8fafc',
        'moon-muted': '#94a3b8',
        'moon-accent': '#38bdf8',
        'moon-accent-hover': '#0ea5e9',
        'moon-error': '#f43f5e',
        'moon-purple': '#c084fc',
      },
      animation: {
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'type-line': 'typeLine 0.1s ease forwards',
        'float': 'float 20s infinite ease-in-out',
        'fade-in': 'fadeIn 0.3s ease',
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', maxHeight: '0' },
          '100%': { opacity: '1', maxHeight: '200px' },
        },
        typeLine: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
