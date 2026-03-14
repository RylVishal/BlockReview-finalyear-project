/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eefbf3',
          100: '#d6f5e3',
          200: '#b0eacc',
          300: '#7dd8ae',
          400: '#48bf8a',
          500: '#25a36e',
          600: '#18845a',
          700: '#156a49',
          800: '#14543c',
          900: '#124532',
          950: '#09271d',
        },
        dark: {
          900: '#080d12',
          800: '#0d1520',
          700: '#121e2e',
          600: '#172438',
          500: '#1d2d45',
          400: '#243554',
          300: '#2d4268',
        },
        accent: {
          cyan:   '#00e5ff',
          green:  '#00ff9d',
          purple: '#b57bff',
          amber:  '#ffb830',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-dark': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          from: { boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)' },
          to:   { boxShadow: '0 0 30px rgba(0, 229, 255, 0.6), 0 0 60px rgba(0, 229, 255, 0.2)' },
        }
      }
    },
  },
  plugins: [],
}
