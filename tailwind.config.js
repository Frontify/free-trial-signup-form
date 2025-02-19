/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  safelist: [
    `text-white`,
    `bg-charcoal`
  ],
  theme: {
    colors: {
      charcoal: `#2d3232`,
      white: `#fff`,
    },
  },
  plugins: [],
}

