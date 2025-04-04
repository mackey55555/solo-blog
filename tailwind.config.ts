import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'var(--foreground)',
            a: {
              color: 'var(--accent-color)',
              '&:hover': {
                color: '#2c4a7c',
              },
            },
            h1: {
              color: 'var(--foreground)',
              fontWeight: '700',
            },
            h2: {
              color: 'var(--foreground)',
              fontWeight: '700',
            },
            h3: {
              color: 'var(--foreground)',
              fontWeight: '600',
            },
            h4: {
              color: 'var(--foreground)',
              fontWeight: '600',
            },
            blockquote: {
              borderLeftColor: 'var(--border-color)',
              color: 'var(--foreground)',
              fontStyle: 'normal',
              paddingLeft: '1rem',
            },
            code: {
              color: 'var(--foreground)',
              backgroundColor: 'var(--light-accent)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            pre: {
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              overflow: 'auto',
              padding: '1rem',
            },
            strong: {
              color: 'var(--foreground)',
              fontWeight: '600',
            },
            img: {
              borderRadius: '0.5rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            ul: {
              listStyleType: 'disc',
            },
            ol: {
              listStyleType: 'decimal',
            },
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            th: {
              borderBottom: '2px solid var(--border-color)',
              padding: '0.5rem',
              textAlign: 'left',
            },
            td: {
              borderBottom: '1px solid var(--border-color)',
              padding: '0.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
