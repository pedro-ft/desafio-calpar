import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',      
    './components/**/*.{js,ts,jsx,tsx,mdx}',  
    './app/**/*.{js,ts,jsx,tsx,mdx}',         
    './src/**/*.{js,ts,jsx,tsx,mdx}',         
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'card-background': 'var(--card-background)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'border-color': 'var(--border-color)',
        'icon-color': 'var(--icon-color)', 
      },
    },
  },
  plugins: [],
};

export default config;