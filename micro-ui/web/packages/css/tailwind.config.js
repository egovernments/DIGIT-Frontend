module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: { enabled: true, content: ["./example/index.html"] },
  digitv2: {
    lightTheme: {
      primary: "#C84C0E",
      "primary-2": "#0b4b66",
      "text-color-primary": "#0B0C0C",
      "text-color-secondary": "#505A5F",
      "text-color-disabled": "#B1B4B6",
      background: "#EEEEEE",
      paper: "#FFFFFF",
      "paper-secondary": "#FAFAFA",
      divider: "#D6D5D4",
      "header-sidenav": "#0B4B66",
      "input-border": "#505A5F",
      "primary-bg": "#FEEFE7",
      "text-primary": "#363636",
      "error-v2": "#D4351C",
      "text-secondary": "#787878",
    },
    alert: {
      error: "#b91900",
      "error-bg": "#EFC7C1",
      success: "#00703C",
      "success-bg": "#BAD6C9",
      info: "#3498DB",
      "info-bg": "#C7E0F1",
    },
    chart: {
      "chart-1": "#048BD0",
      "chart-1-gradient": "#048BD0",
      "chart-2": "#FBC02D",
      "chart-2-gradient": "#FBC02D",
      "chart-3": "#8E29BF",
      "chart-4": "#EA8A3B",
      "chart-5": "#0BABDE",
    },
    fontSize: {
      "heading-xl": {
        mobile: "2rem",
        tablet: "2.25rem",
        desktop: "2.5rem",
      },
      "heading-l": {
        mobile: "1.5rem",
        tablet: "1.75rem",
        desktop: "2rem",
      },
      "heading-m": {
        mobile: "1.25rem",
        tablet: "1.375rem",
        desktop: "1.5rem",
      },
      "heading-s": {
        mobile: "1rem",
        tablet: "1rem",
        desktop: "1rem",
      },
      "heading-xs": {
        mobile: "0.75rem",
      },
      "caption-l": {
        mobile: "1.5rem",
        tablet: "1.75rem",
        desktop: "1.75rem",
      },
      "caption-m": {
        mobile: "1.25rem",
        tablet: "1.5rem",
        desktop: "1.5rem",
      },
      "caption-s": {
        mobile: "1rem",
        tablet: "1.25rem",
        desktop: "1.25rem",
      },
      "body-l": {
        mobile: "1rem",
        tablet: "1.25rem",
        desktop: "1.25rem",
      },
      "body-s": {
        mobile: "0.875rem",
        tablet: "1rem",
        desktop: "1rem",
      },
      "body-xs": {
        mobile: "0.75rem",
        tablet: "0.875rem",
        desktop: "0.875rem",
      },
      label: {
        mobile: "1rem",
        tablet: "1rem",
        desktop: "1rem",
      },
      link: {
        mobile: "1rem",
        tablet: "1rem",
        desktop: "1rem",
      },
    },
    fontFamily: {
      sans: ["Roboto"],
      rc: ['"Roboto Condensed"'],
    },
    fontStyle: {
      normal: "normal",
      italic: "italic",
    },
    textDecorationLine: {
      underline: "underline",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    lineHeight: {
      "line-height-body-l": { mobile: "1.5rem", tablet: "1.75rem", desktop: "1.75rem" },
      "line-height-body-s": { mobile: "1.0938rem", tablet: "1.5rem", desktop: "1.5rem" },
      "line-height-body-xs": { mobile: "1.125rem", tablet: "1.5rem", desktop: "1.5rem" },
      normal: "normal",
    },
    screens: {
      mobile: "400px",
      tablet: "768px",
      desktop: "1024px",
    },
  },
  variants: {},
  plugins: [],
};