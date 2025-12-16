/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/daisyui/dist/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        // Light Purple Theme - Primary: #B399D4
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#B399D4',
          50: '#FAF5FF',
          100: '#F5F3FF',
          200: '#E6E6FA',
          300: '#D8BFD8',
          400: '#DDA0DD',
          500: '#B399D4',
          600: '#9370DB',
          700: '#8A68C6',
          800: '#7454B8',
          900: '#5E3A9E',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // Additional semantic colors
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        success: 'hsl(var(--success))',
        'success-foreground': 'hsl(var(--success-foreground))',
        warning: 'hsl(var(--warning))',
        'warning-foreground': 'hsl(var(--warning-foreground))',
        info: 'hsl(var(--info))',
        'info-foreground': 'hsl(var(--info-foreground))',
        error: 'hsl(var(--error))',
        'error-foreground': 'hsl(var(--error-foreground))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          'primary': '#B399D4',
          'primary-content': '#ffffff',
          'secondary': '#DDA0DD',
          'secondary-content': '#1f1f1f',
          'accent': '#9370DB',
          'accent-content': '#ffffff',
          'neutral': '#3d4451',
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#F5F3FF',
          'base-300': '#E6E6FA',
          'base-content': '#1f2937',
          'info': '#06b6d4',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444',
        },
        dark: {
          // Vibrant Purple Universe Theme - NO GRAYS, only rich colors!
          'primary': '#c77dff',            // NEON electric purple
          'primary-content': '#1a0f2e',    // Deep purple for contrast
          'secondary': '#9d4edd',          // Vibrant purple-violet
          'secondary-content': '#f5f0ff',  // Purple-tinted white
          'accent': '#b794f6',             // Bright lavender
          'accent-content': '#1a0f2e',     // Deep purple
          'neutral': '#261952',            // Rich violet (not gray!)
          'neutral-content': '#f5f0ff',    // Purple-white
          'base-100': '#1a0f2e',           // Deep purple cosmos base
          'base-200': '#261952',           // Rich violet surface
          'base-300': '#3d2f7f',           // Royal indigo elevated
          'base-content': '#f5f0ff',       // Purple-tinted white
          'info': '#0ec9ff',               // Electric neon cyan
          'success': '#26d97f',            // Neon green glow
          'warning': '#ffa31a',            // Bright glowing amber
          'error': '#f24766',              // Hot pink-red vibrant
        },
      },
    ],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
  },
}
