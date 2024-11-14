export const tableCustomStyle = {
  tableWrapper: {
    style: {
      overflow: "visible",
    },
  },
  table: {
    style: {
      overflow: "visible",
    },
  },
  responsiveWrapper: {
    style: {
      overflow: "visible",
    },
  },
  contextMenu: {
    style: {
      overflow: "visible",
    },
  },
  header: {
    style: {
      minHeight: "56px",
    },
  },
  rows: {
    style: {
      backgroundColor: "#FFFFFF",
      "&:hover": {
        backgroundColor: "#FBEEE8",
      },
    },
  },
  headRow: {
    style: {
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: "#D6D5D4",
      backgroundColor: "#EEEEEE",
    },
  },
  headCells: {
    style: {
      "&:first-of-type": {
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: "#D6D5D4",
        borderTopLeftRadius: "0.25rem",
      },
      "&:last-of-type": {
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: "#D6D5D4",
        borderTopRightRadius: "0.25rem",
      },
      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: "#D6D5D4",
      fontFamily: "Roboto",
      fontWeight: "700",
      fontStyle: "normal",
      fontSize: "16px",
      color: "#0B4B66",
      padding: "16px",
      lineHeight: "1.14rem",
    },
  },
  cells: {
    style: {
      "&:first-of-type": {
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: "#D6D5D4",
      },
      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: "#D6D5D4",
      color: "#363636",
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "1.37rem",
      textAlign: "left",
      fontSize: "16px",
      padding: "16px",
    },
    pagination: {
      style: {
        marginTop: "-60px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#D6D5D4",
        borderTopWidth: "0px",
      },
    },
  },
};
