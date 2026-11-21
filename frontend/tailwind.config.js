/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          brand: '#167A4D',
          'brand-hover': '#12603C',
          'brand-light': '#E8F4EC',
          municipal: '#12382C',
          primary: '#167A4D',
          'primary-hover': '#12603C',
          secondary: '#64748B',
          text: '#17243A',
          muted: '#64748B',
          border: '#E2ECE5',
          soft: '#F0F8F3',
          critical: '#DC2626',
          warning: '#D97706',
          resolved: '#167A4D',
          success: '#167A4D',
          // Municipal Category Tokens
          roads: '#DC2626',
          sanitation: '#167A4D',
          electrical: '#D97706',
          water: '#2563EB',
          drainage: '#7C3AED',
          parks: '#059669',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
        'card': '0 1px 3px 0 rgba(16, 24, 40, 0.1), 0 1px 2px -1px rgba(16, 24, 40, 0.1)',
        'panel': '0 4px 6px -1px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.1)',
        'elevated': '0 10px 15px -3px rgba(16, 24, 40, 0.1), 0 4px 6px -4px rgba(16, 24, 40, 0.1)',
      },
      borderRadius: {
        'civic': '12px',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
}
