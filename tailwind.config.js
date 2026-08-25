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
        sans: ['Inter', 'Outfit', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        obsidian: '#09090b',
        surface: '#121215',
        indigoAcc: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          glow: 'rgba(99, 102, 241, 0.15)',
        },
        emeraldAcc: '#22c55e',
        cardBorder: '#1f1f23',
      },
    },
  },
  plugins: [],
};
