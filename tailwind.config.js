/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/lib/**/*.js",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js"
  ],
  theme: {
    container: {
      center: true
    },
    screens: {
      'sm': '576px', // Corrigido '576x' para '576px'
      'md': '768px',
      'lg': '1024px',
      'tc': '1280px',
      'xl': '1560px',
      '2xl': '1920px'
    },
    fontSize: {
      xs: ['11px', '12px'],
      sm: ['12px', '18px'],
      base: ['14px', '20px'],
      lg: ['16px', '22px'],
      xl: ['18px', '24px'], // Corrigido '24x' para '24px'
      "2xl": ['20px', '26px'], // Corrigido '26x' para '26px'
      "3xl": ['22px', '28px'],
      "4xl": ['24px', '30px'],
      "5xl": ['26px', '32px'],
      "6xl": ['28px', '34px'],
      "7xl": ['30px', '36px'],
      "8xl": ['32px', '38px'],
      "9xl": ['34px', '40px']
    },
    extend: {
      backgroundImage: {
        "fundo-rhbrasil": "url('/images/logos/rhbrasil/fundo_rhb.jpg')"
      },
      colors: {
        'primary': 'rgb(28, 100, 242)',
        'secondary': 'rgb(255,150, 0)',
        'danger': 'rgb(255, 0, 0)',
        'warning': 'rgb(255, 100, 0)',
        'drop-shadow-1': 'rgba(0, 0, 0, 0.1)',
        'drop-shadow-2': 'rgba(0, 0, 0, 0.2)',
        'drop-shadow-3': 'rgba(0, 0, 0, 0.3)',
        'drop-shadow-4': 'rgba(0, 0, 0, 0.4)',
        'drop-shadow-5': 'rgba(0, 0, 0, 0.5)',
        'drop-shadow-6': 'rgba(0, 0, 0, 0.6)',
        'drop-shadow-7': 'rgba(0, 0, 0, 0.7)',
        'drop-shadow-8': 'rgba(0, 0, 0, 0.8)',
        'drop-shadow-9': 'rgba(0, 0, 0, 0.9)',
        'white-shadow-1': 'rgba(255, 255, 255, 0.1)',
        'white-shadow-2': 'rgba(255, 255, 255, 0.2)',
        'white-shadow-3': 'rgba(255, 255, 255, 0.3)',
        'white-shadow-4': 'rgba(255, 255, 255, 0.4)',
        'white-shadow-5': 'rgba(255, 255, 255, 0.5)',
        'white-shadow-6': 'rgba(255, 255, 255, 0.6)',
        'white-shadow-7': 'rgba(255, 255, 255, 0.7)',
        'white-shadow-8': 'rgba(255, 255, 255, 0.8)',
        'white-shadow-9': 'rgba(255, 255, 255, 0.9)'
      },
      spacing: {
        '1/6': '16.666667%',
        '100': '100px',
        '200': '200px'
      },
      animation: {
        loading: 'loadingAnimation 1s infinite linear',
        'rotate-y': 'rotate-y 2s linear infinite',
        'loading-slide': 'loadingSlide 1.5s ease-in-out infinite',
        'loading-wave': 'loadingWave 2s ease-in-out infinite',
      },
      backgroundImage: {
        'loading-gradient': `radial-gradient(in oklab, var(--tw-gradient-stops))`,
        'loading-slide-gradient': 'linear-gradient(90deg, transparent 0%, var(--tw-gradient-from) 50%, transparent 100%)',
      },
      keyframes: {
        loadingAnimation: {
          '0%': { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition: '100% 0' },
        },
        "rotate-y": {
          from: {
            transform: 'rotateY(0deg)',
          },
          to: {
            transform: 'rotateY(360deg)',
          },
        },
        loadingSlide: {
          '0%': { 
            backgroundPosition: '-200% center',
            opacity: '0.3'
          },
          '50%': {
            opacity: '1'
          },
          '100%': { 
            backgroundPosition: '200% center',
            opacity: '0.3'
          },
        },
        loadingWave: {
          '0%': { 
            backgroundPosition: '-100% center',
            backgroundSize: '200% 100%'
          },
          '100%': { 
            backgroundPosition: '100% center',
            backgroundSize: '200% 100%'
          },
        },
      },
      transitionTimingFunction: {
        'ease-in': 'ease-in',
      },
      transitionDuration: {
        '300': '300ms',
      },
      boxShadow: {
        'custom-blue': '3px 3px 3px 3px rgb(48 84 162)',
      },
      dropShadow: {
        'text-dark': '2px 2px 4px rgba(0, 0, 0, 0.8)',
        'text-darker': '2px 2px 4px rgba(0, 0, 0, 0.9)',
        'text-black': '1px 1px 2px rgba(0, 0, 0, 1)',
        'text-heavy': '2px 2px 6px rgba(0, 0, 0, 0.7)',
        'text-subtle-dark': '1px 1px 2px rgba(0, 0, 0, 0.6)',
      },
    }
  },
  // safelist: [
  //   {pattern: /border-b-\d/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /border-gray-(\d{3})/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /bg-gray-(\d{3})/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /overflow-(y|x)?-?(\w)*/},
  //   {pattern: /flex-?(row|col|nowrap|wrap)*/},
  //   {pattern: /grid-cols-\d\d*/},
  //   {pattern: /col-span-\d\d*/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /w-\d\d*/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /w-[0-9]\/[0-9]/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /w-(full|fit|screen|auto)/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /h-[0-9]\/[0-9]/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /h-\d\d*/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /h-(full|fit|screen|auto)/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /p(r|l|b|t|y|x)?-\d\d*/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /m(r|l|b|t|y|x)?-(\d\d*|auto)/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /text-(\d?xl|\w*)/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /text-gray-(\d{3})/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /float-\w*/, variants: ['sm', 'md', 'lg', 'xl']},
  //   {pattern: /rounded-?\w*/, variants: ['sm', 'md', 'lg', 'xl']},
  //   'absolute',
  //   'fixed',
  //   'block',
  //   'hidden',
  //   'fill-black',
  //   'font-bold',
  // ],
  plugins: [
    require('flowbite/plugin')
  ]
};
