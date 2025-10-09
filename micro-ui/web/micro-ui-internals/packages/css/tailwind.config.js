module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: { enabled: true, content: ["./example/index.html"] },
  theme: {
    screens: {
      dt: "780px",
      sm: { max: "425px" },
    },
    colors: {
      primary: {
        light: "#F18F5E",
        main: "#F47738",
        dark: "#C8602B",
      },
      secondary: "#22394D",
      text: {
        primary: "#0B0C0C",
        secondary: "#505A5F",
      },
      link: {
        normal: "#1D70B8",
        hover: "#003078",
      },
      border: "#D6D5D4",
      inputBorder: "#464646",
      "input-border": "#464646",
      focus: "#F47738",
      error: "#D4351C",
      success: "#00703C",
      black: "#000000",
      grey: {
        dark: "#9E9E9E",
        mid: "#EEEEEE",
        light: "#FAFAFA",
        bg: "#E3E3E3",
      },
      white: "#FFFFFF",
    },
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
      rc: ['"Roboto Condensed"', "sans-serif"],
    },
    fontSize: {
      "heading-xl-dt": ["48px", "56px"],
      "heading-xl": ["32px", "40px"],
      "heading-l-dt": ["36px", "40px"],
      "heading-l": ["24px", "32px"],
      "heading-m-dt": ["24px", "32px"],
      "heading-m": ["18px", "28px"],
      "heading-s": ["16px", "24px"],
      "body-l": ["18px", "28px"],
      "body-m": ["16px", "24px"],
      "body-s": ["14px", "20px"],
      "body-xs": ["12px", "16px"],
    },
    extend: {},
  },
  variants: {},
  plugins: [],
};