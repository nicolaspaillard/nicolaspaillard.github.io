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
          border: "1px solid #00ff00",
          "backdrop-filter": "blur(4px)",
        },
      });
    }),
  ],
  corePlugins: {
    preflight: false,
  },
};
