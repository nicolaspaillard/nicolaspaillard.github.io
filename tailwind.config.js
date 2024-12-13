/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities, theme }) {
      addComponents({
        ".card": {
          backgroundColor: "rgba(20,20,20,0.1)",
          border: "2px solid #00a000",
          "backdrop-filter": "blur(4px)",
        },
      });
    }),
  ],
  corePlugins: {
    preflight: false,
  },
};
