/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // LifeWayUSA Brand Colors (from GraphicConcept.md)
        'azul-petroleo': '#084c61',    // Primary accent (Petrole Blue)
        'petrole': '#084c61',          // Alias for consistency
        'lilas': '#e9d5ff',            // Secondary (Lilac)
        'lilas-claro': '#e9d5ff',      // Alias for consistency
        'cinza-claro': '#f3f4f6',      // Card background (Light Gray)
        
        // Extended palette for the new design
        'petrole-dark': '#063a4a',     // Darker petrole for hover states
        'petrole-light': '#0a5d75',    // Lighter petrole for gradients
        'lilas-dark': '#d8b4fe',       // Darker lilac for hover states
        'lilas-light': '#f3e8ff',      // Lighter lilac for backgrounds
        
        // Lilac color scale for components
        'lilac': {
          100: '#f3e8ff',
          200: '#e9d5ff', 
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
        },
        
        // Custom colors for ToolsShowcase alternating pattern
        'rose': {
          900: '#4c191b',  // Dark wine red
        },
        'pink': {
          700: '#963d5a',  // Medium burgundy
        },
      },
      fontFamily: {
        'baskerville': ['Libre Baskerville', 'serif'],  // Display H1-H2
        'figtree': ['Figtree', 'sans-serif'],           // Body/UI text
      },
      fontSize: {
        'hero': ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        'hero-mobile': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'subtitle': ['24px', { lineHeight: '1.4', fontWeight: '400' }],
        'subtitle-mobile': ['18px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
      },
      height: {
        'screen-90': '90vh',
        'screen-80': '80vh',
        'hero': '100vh',
        'hero-mobile': '70vh',
        'navbar': '96px',
        'utility-bar': '32px',
        'footer': '400px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-petrole': 'linear-gradient(135deg, #084c61 0%, #0a5d75 100%)',
        'gradient-lilas': 'linear-gradient(135deg, #e9d5ff 0%, #f3e8ff 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'ken-burns': 'ken-burns 20s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1.0)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1.0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'navbar': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}