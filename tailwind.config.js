import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    path.join(__dirname, 'index.html').replace(/\\/g, '/'),
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx}').replace(/\\/g, '/'),
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        serif: ['Fraunces', 'serif'],
        sans: ['Syne', 'sans-serif'],
      },
      colors: {
        ivory: '#F5F0E8',
        cream: '#EDE7D9',
        paper: '#FAF7F2',
        charcoal: '#1A1814',
        ink: '#0F0E0C',
        taxEmerald: {
          DEFAULT: '#059669',
          dark: '#064E3B',
          light: '#D1FAE5',
        },
        gold: '#D97706',
        rose: '#E11D48',
        cardBorder: '#E2DAC8',
      },
    },
  },
  plugins: [],
};
