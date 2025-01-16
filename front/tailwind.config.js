/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#eab308",
          "secondary": "#fef9c3",
          "accent": "#713f12",
          "neutral": "#eab308",
          "base-100": "#1c1917",
          "info": "#713f12",
          "success": "#3f6212",
          "warning": "#ea580c",
          "error": "#b91c1c",
        },
      },
      "black",
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
}