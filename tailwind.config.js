module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      "display": "var(--display-font)",
      "body": "var(--body-font)",
    },
  },
  plugins: [],
};
