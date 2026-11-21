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
          bg: '#F3F2EE',
          surface: '#FFFFFF',
          brand: '#203D32',
          'brand-hover': '#172c24',
          secondary: '#87998C',
          text: '#202522',
          muted: '#68736E',
          border: '#E3E4DE',
          soft: '#EAF1EB',
          critical: '#D9534F',
          warning: '#E0A526',
          resolved: '#2F8F68',
          // Category tokens
          roads: '#D9534F',
          sanitation: '#5B9A5B',
          electrical: '#E0A526',
          water: '#3B82C4',
          drainage: '#8A63C9',
          parks: '#2F8F83',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
        editorial: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 16px -4px rgba(32, 61, 50, 0.06)',
        'panel': '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'civic': '8px',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
}
