/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f0f0f',
          card: '#1a1a1a',
          hover: '#2a2a2a',
        },
        accent: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          hover: '#5558e3',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a1a1aa',
          muted: '#71717a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        blockquest: {
          "primary": "#5B7C99",        // Soft slate blue
          "secondary": "#7FA99B",      // Sage green
          "accent": "#9B8B7E",         // Warm taupe
          "neutral": "#E8DFD0",        // Cream
          "base-100": "#F5F3EF",       // Off-white background
          "base-200": "#EBE7E0",       // Light warm gray
          "base-300": "#D4CEC3",       // Medium warm gray
          "info": "#6B9AC4",           // Soft blue
          "success": "#8BA888",        // Soft green
          "warning": "#D4A574",        // Soft amber
          "error": "#C07A7A",          // Soft red
          "base-content": "#3E4E5E",   // Dark slate for text
        },
      },
    ],
    darkTheme: "blockquest",
    base: true,
    styled: true,
    utils: true,
  },
}
