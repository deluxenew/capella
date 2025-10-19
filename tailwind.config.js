// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      width: {
        '85': '340px',
      },
      maxWidth: {
        '85': '340px',
      },
      minHeight: {
        '70': '280px',
      },
      colors: {
        dark: '#1c2027',
        onyx: '#343841',
        'raisin-black': '#22252f',
        gray: {
          DEFAULT: '#787b89',
          lighten: '#e2e2e2',
          'semi-lighten': '#c4c4c4',
        },
        blue: {
          DEFAULT: '#4276f6',
          darken: '#3c67d0',
        },
        white: {
          DEFAULT: '#ffffff',
          darken: '#f6f6f6',
        },
        green: {
          DEFAULT: '#76c499',
          darken: 'rgba(118, 196, 153, 0.2)',
        },
        red: {
          DEFAULT: '#f34c2d',
          darken: 'rgba(243, 76, 45, 0.2)',
        },
        charade: '#232630',
        orange: '#e8b363',
        stable: '#b5a8ff',
        coin: '#9fe0ff',
        dex: '#aaffcb',
        purple: '#6f6ffb',

        // Добавляем кастомные цвета для CSS variables
        'bg-secondary': 'var(--bg-secondary)',
        'border-color': 'var(--border-color)',
        'color': 'var(--color)',
        'color-svg': 'var(--color_svg)',
      },
      spacing: {
        '85': '340px',
        'sidebar-opened': '320px',
        'sidebar-closed': '125px',
      },
      maxWidth: {
        '310': '1240px',
      },
      backgroundColor: {
        'secondary': 'var(--bg-secondary)',
      },
      textColor: {
        'color': 'var(--color)',
        'svg': 'var(--color_svg)',
      },
      borderColor: {
        'border': 'var(--border-color)',
      },
      boxShadow: {
        'blue': '0px 9px 24px rgba(66, 118, 246, 0.4)',
      },
      animation: {
        'bounce-loader': 'bounce-loader 1.2s ease-in-out infinite',
      },
      keyframes: {
        'bounce-loader': {
          '0%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-100%)' },
          '75%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animationDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      }
    },
  },
  plugins: [],
}
