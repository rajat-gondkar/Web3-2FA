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
          "primary": "#6366f1",        // Indigo
          "secondary": "#8b5cf6",      // Purple
          "accent": "#ec4899",         // Pink
          "neutral": "#1f2937",        // Dark gray
          "base-100": "#0f172a",       // Slate 900 - Dark background
          "base-200": "#1e293b",       // Slate 800
          "base-300": "#334155",       // Slate 700
          "info": "#3b82f6",           // Blue
          "success": "#10b981",        // Emerald
          "warning": "#f59e0b",        // Amber
          "error": "#ef4444",          // Red
          "base-content": "#f1f5f9",   // Light text on dark
        },
      },
    ],
    darkTheme: "blockquest",
    base: true,
    styled: true,
    utils: true,
  },
}
