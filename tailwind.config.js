module.exports = {
  content: ['./src/app/**/*.{js,jsx,ts,tsx}', './src/public/index.html'],

  // darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'light-shade': '#F8FAF4', // ivory white
        'light-accent': '#1B4942', // darkish-green-(text)
        'main-brand': '#21CD9C', // bright-green
        'dark-accent': '#88715F', // weird-brown
        'dark-shade': '#212732', // dark-purple
      },
    },
  },
  variants: {
    opacity: ({ after }) => after(['disabled']),
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
