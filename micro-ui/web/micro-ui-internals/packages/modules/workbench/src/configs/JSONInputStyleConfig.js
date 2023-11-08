const colorsConfigJson = {
    default: "#000", // Default text color (black)
    background: "#FFF", // Background color (white)
    string: "#E91E63", // String values color (pink)
    keys: "#795548", // Keys color (brown)
    number: "#2196F3", // Number values color (blue)
    colon: "#9C27B0", // Colon color (purple)
    primitive: "#00BCD4", // Boolean values and null color (cyan)
    error: "#FF5722", // Error color (amber)
    keys_whiteSpace: "#607D8B", // Keys in quotes color (blue-grey)
    background_warning: "#FFEB3B", // Background for warning message (yellow)
};

const styleConfigJson = {
    outerBox: {
        border: "1px solid #E0E0E0",
        borderRadius: "5px",
    },
    container: {
        border: "1px solid #E0E0E0",
        borderRadius: "5px",
    },
    warningBox: {
        backgroundColor: "#FFEB3B",
        border: "1px solid #FFC107",
        borderRadius: "5px",
    },
    errorMessage: {
        color: "#D84315",
    },
    body: {
        padding: "10px",
    },
    labels: {
        fontWeight: "bold",
    },
    contentBox: {
        display: "inline-block",
    },
};


export { colorsConfigJson, styleConfigJson }
