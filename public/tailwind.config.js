module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {

    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwind-forms')(),
    tailwindcss('./tailwind.config.js'),
    require('autoprefixer'),
  ],
}




  