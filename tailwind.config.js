/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "system-ui"],
        serif: ["Arapey", "serif"],
      },

      colors: {
        dark: "#161A1B",
        light: "#4F5561",
        dark_red: "#260303",
        red: "#400606",
        off_white: "#F2F2F2",
        white: "#FFFFFF",
        gray: "#999999",
        dark_gray: "#444444",
        green: "rgb(20 83 45)",
        blue: "#1E90FF",
        light_red: "rgb(239, 68, 68)",
        button_original:"oklch(52.5% 0.223 3.958)",
        button_border:"oklch(45.9% 0.187 3.815)",
        pink_dark: "oklch(52.5% 0.223 3.958)" ,
        pink_second_dark:"oklch(59.2% 0.249 0.584)",
        pink_light:"oklch(65.6% 0.241 354.308)",
        pink_second_light:"oklch(71.8% 0.202 349.761)",
        pink_super_light:"oklch(89.2% 0.058 10.001)",
        
      },

      borderRadius: {
        full: "999px",
        rsm: "5px",
        rmd: "10px",
        rlg: "15px",
      },
    },
  },
  plugins: [],
};
