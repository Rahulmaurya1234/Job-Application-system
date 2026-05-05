// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10B981",
        primaryDark: "#0F766E",
      },
      boxShadow: {
        soft: "0 30px 60px rgba(15, 23, 42, 0.14)",
      },
    },
  },
  plugins: [],
}