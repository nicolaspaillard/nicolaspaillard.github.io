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
          backgroundColor: "rgba(255,255,255,0.1)",
          border: "1px solid green",
          "backdrop-filter": "blur(4px)",
        },
      });
    }),
  ],
  corePlugins: {
    preflight: false,
  },
};
