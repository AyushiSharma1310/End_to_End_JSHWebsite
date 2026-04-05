/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        scroll: "scroll 15s linear infinite",
        fadeUp: "fadeUp 0.8s ease-out forwards",
        slideImages: "slideImages 6s infinite",
      },

      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },

        slideImages: {
          "0%, 25%": { transform: "translateX(0%)" },
          "25%, 50%": { transform: "translateX(-100%)" },
          "50%, 75%": { transform: "translateX(-200%)" },
          "75%, 100%": { transform: "translateX(-300%)" },
          "100%": { transform: "translateX(0%)" },
        },

        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};