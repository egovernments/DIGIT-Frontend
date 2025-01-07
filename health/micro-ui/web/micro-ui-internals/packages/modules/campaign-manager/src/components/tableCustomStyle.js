export const tableCustomStyle = {
  tableWrapper: {
    style: {},
  },
  table: {
    style: {},
  },
  responsiveWrapper: {
    style: {},
  },
  contextMenu: {
    style: {},
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
      borderBottom: "1px solid #D6D5D4", // Horizontal lines between rows
    },
  },
  headRow: {
    style: {
      borderBottom: "1px solid #D6D5D4",
      backgroundColor: "#EEEEEE",
    },
  },
  headCells: {
    style: {
      fontFamily: "Roboto",
      fontWeight: "700",
      fontStyle: "normal",
      fontSize: "16px",
      color: "#0B4B66",
      padding: "16px",
      lineHeight: "1.14rem",
      borderBottom: "1px solid #D6D5D4", // Only horizontal lines in header
      borderRight: "none", // Remove vertical lines
    },
  },
  cells: {
    style: {
      color: "#363636",
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "1.37rem",
      textAlign: "left",
      fontSize: "16px",
      padding: "16px",
      borderBottom: "1px solid #D6D5D4", // Horizontal lines between rows
      borderRight: "none", // Remove vertical lines
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


export const getTableCustomStyle = (freezeFirstColumn = false) => ({
  tableWrapper: {
    style: {
      // overflow: "scroll",
    },
  },
  table: {
    style: {
      // overflow: "scroll",
    },
  },
  responsiveWrapper: {
    style: {
      // overflow: "scroll",
    },
  },
  contextMenu: {
    style: {
      // overflow: "scroll",
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
        ...(freezeFirstColumn && {
          borderLeftStyle: "solid",
          borderLeftWidth: "1px",
          borderLeftColor: "#D6D5D4",
          borderTopLeftRadius: "0.25rem",
          position: "sticky",
          left: 0,
          backgroundColor: "#EEEEEE",
          zIndex: 2,
        }),
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
        ...(freezeFirstColumn && {
          borderLeftStyle: "solid",
          borderLeftWidth: "1px",
          borderLeftColor: "#D6D5D4",
          position: "sticky",
          left: 0,
          backgroundColor: "#FFFFFF",
          zIndex: 1,
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        }),
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
});
