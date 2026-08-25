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
        sans: ['Syne', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
        mono: ['DM Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        ivory: '#F5F0E8',
        cream: '#EDE7D9',
        paper: '#FAF7F2',
        charcoal: '#1A1814',
        ink: '#2D2A26',
        muted: '#6B6560',
        accent: {
          DEFAULT: '#0047FF',
          light: '#E8EEFF',
          warm: '#FF4D00',
        },
        line: 'rgba(26,24,20,0.12)',
      },
    },
  },
  plugins: [],
};
