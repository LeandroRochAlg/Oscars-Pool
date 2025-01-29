/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "media",
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        mythemedark: {
          "primary": "#eab308",
          "secondary": "#fef9c3",
          "accent": "#713f12",
          "neutral": "#eab308",
          "base-100": "#1c1917",
          "base-200": "#fef3c7",
          "info": "#713f12",
          "success": "#3f6212",
          "warning": "#ea580c",
          "error": "#b91c1c",
        },
      },
      {
        mythemelight: {
          "primary": "#eab308",
          "secondary": "#fef9c3",
          "accent": "#713f12",
          "neutral": "#eab308",
          "base-100": "#fef3c7",
          "base-200": "#1c1917",
          "info": "#713f12",
          "success": "#3f6212",
          "warning": "#ea580c",
          "error": "#b91c1c",
        },
      },
      "black",
    ],
    darkTheme: "mydarktheme",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
}