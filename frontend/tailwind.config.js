/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        serv: {
          950: '#1a0f2e',
          900: '#2a1b3d',
          800: '#3d2560',
          700: '#422f71',
          600: '#553c9a',
          500: '#6b46c1',
          400: '#805ad5',
          300: '#9f7aea',
          200: '#c4b5fd',
          100: '#ede9fe',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Arial', 'sans-serif'],
        display: ['Space Grotesk', 'Montserrat', 'sans-serif'],
      },
      maxWidth: { site: '1200px' },
      borderRadius: { serv: '20px' },
      boxShadow: {
        purple: '0 20px 60px rgba(107,70,193,.25)',
      },
      transitionTimingFunction: { serv: 'cubic-bezier(.25,.46,.45,.94)' },
      keyframes: {
        orbit: {
          from: { transform: 'translate(-50%,-50%) rotateY(-180deg) translateZ(400px) rotateY(12deg)' },
          to: { transform: 'translate(-50%,-50%) rotateY(180deg) translateZ(400px) rotateY(12deg)' },
        },
      },
      animation: { orbit: 'orbit 32s linear infinite' },
    },
  },
  plugins: [],
}
