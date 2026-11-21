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
          bg: '#F7F9FC',
          surface: '#FFFFFF',
          brand: '#2457D6',
          'brand-hover': '#1948B5',
          'brand-light': '#EEF3FF',
          secondary: '#64748B',
          text: '#17243A',
          muted: '#64748B',
          border: '#E2E8F0',
          soft: '#F1F5F9',
          critical: '#DC4545',
          warning: '#E9A23B',
          resolved: '#16A36A',
          success: '#16A36A',
          // Municipal Category Tokens
          roads: '#DC4545',
          sanitation: '#16A36A',
          electrical: '#E9A23B',
          water: '#2563EB',
          drainage: '#7C3AED',
          parks: '#0D9488',
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
