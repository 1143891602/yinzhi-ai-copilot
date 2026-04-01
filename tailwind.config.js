/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'apple-black': '#0f172a',
        'apple-gray': '#334155',
        'nothing-gray': '#f8f7fb',
        'premium-purple': '#6e2cf2',
        'premium-blue': '#2196f3',
        'premium-pink': '#ec4899',
        'premium-cream': '#fffdf8',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'PingFang SC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        breathe: 'breathe 8s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 4s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'float-slow': 'floatSlow 10s ease-in-out infinite',
        drift: 'drift 14s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.82', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.26', filter: 'blur(40px)' },
          '50%': { opacity: '0.5', filter: 'blur(60px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-16px,0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(18px,-12px,0) scale(1.04)' },
        },
      },
      backdropBlur: {
        premium: '28px',
      },
      boxShadow: {
        glow: '0 20px 50px rgba(110, 44, 242, 0.16)',
        soft: '0 14px 35px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
