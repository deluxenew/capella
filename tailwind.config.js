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
    fontWeight: {
      'bold': '500',
      'semibold': '600',
      'medium': '500',
    },
    spacing: {
      0: '0',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
      10: '40px',
      11: '44px',
      12: '48px',
      13: '52px',
      14: '56px',
      15: '60px',
      16: '64px',
      17: '68px',
      18: '72px',
      19: '76px',
      20: '80px',
      22: '88px',
      23: '92px',
      24: '96px',
      28: '112px',
      32: '128px',
      full: '100%',
      auto: 'auto',
    },
    extend: {
      width: {
        '85': '340px',
        '30': '120px',
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
          lighten: 'rgb(194 194 194)',
          'semi-lighten': '#c4c4c4',
          lighten2: 'rgb(93 93 93)',
        },
        'light-blue': {
          DEFAULT: 'rgba(66, 118, 246, .4)'
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
          darken: '#428a62',
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
        secondary: 'var(--bg-secondary)',
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
        'light-blue': '0px 12px 16px rgba(66, 118, 246, 0.4)',
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
