/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Extend neutral grays for more granular control
        neutral: {
          950: '#0a0a0a',
        },
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#a3a3a3',
            a: {
              color: '#ffffff',
              '&:hover': {
                color: '#d4d4d4',
              },
            },
          },
        },
      },
    },
  },
  plugins: [],
}