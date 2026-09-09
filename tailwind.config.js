/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#0A0A0B',
          surface: '#121214',
          border: '#1A1A1E',
          subtle: '#222226',
        },
        laser: {
          DEFAULT: '#FF7A00',
          hover: '#FF8F1F',
          glow: 'rgba(255, 122, 0, 0.4)',
          dim: 'rgba(255, 122, 0, 0.15)',
        },
        metal: {
          100: '#F5F5F7',
          200: '#E5E2E3',
          300: '#C8C6C8',
          400: '#949298',
          500: '#646268',
        }
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      fontSize: {
        // Scaled-up typography for maximum visual clarity across all devices
        'xs': ['0.875rem', { lineHeight: '1.45' }],       // 14px (scaled to 15-16.5px with root)
        'sm': ['1rem', { lineHeight: '1.55' }],           // 16px (scaled to 18-19px with root)
        'base': ['1.125rem', { lineHeight: '1.65' }],     // 18px (scaled to 20-21px with root)
        'lg': ['1.25rem', { lineHeight: '1.6' }],         // 20px (scaled to 22.5-24px with root)
        'xl': ['1.5rem', { lineHeight: '1.45' }],         // 24px (scaled to 27-28.5px with root)
        '2xl': ['1.875rem', { lineHeight: '1.35' }],      // 30px (scaled to 34-36px with root)
        '3xl': ['2.375rem', { lineHeight: '1.3' }],       // 38px (scaled to 42-45px with root)
        '4xl': ['3rem', { lineHeight: '1.2' }],           // 48px (scaled to 54-57px with root)
        '5xl': ['3.875rem', { lineHeight: '1.15' }],      // 62px (scaled to 70-74px with root)
        '6xl': ['4.875rem', { lineHeight: '1.1' }],       // 78px (scaled to 88-93px with root)
        '7xl': ['5.875rem', { lineHeight: '1.05' }],      // 94px (scaled to 105-112px with root)
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.15em',
      },
      boxShadow: {
        'laser-glow': '0 0 25px rgba(255, 122, 0, 0.35)',
        'laser-glow-sm': '0 0 12px rgba(255, 122, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
