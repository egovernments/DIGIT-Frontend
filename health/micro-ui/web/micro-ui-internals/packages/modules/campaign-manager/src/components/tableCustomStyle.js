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
      minHeight: "3.5rem", // 56px
    },
  },
  rows: {
    style: {
      backgroundColor: "#FFFFFF",
      "&:hover": {
        backgroundColor: "#FBEEE8",
      },
      borderBottom: "0.0625rem solid #D6D5D4", // 1px
    },
  },
  headRow: {
    style: {
      borderBottom: "0.0625rem solid #D6D5D4", // 1px
      backgroundColor: "#EEEEEE",
    },
  },
  headCells: {
    style: {
      fontFamily: "Roboto",
      fontWeight: "700",
      fontStyle: "normal",
      fontSize: "1rem", // 16px
      color: "#0B4B66",
      padding: "1rem", // 16px
      lineHeight: "1.14rem", // 18.24px
      borderBottom: "0.0625rem solid #D6D5D4", // 1px
      borderRight: "none",
    },
  },
  cells: {
    style: {
      color: "#363636",
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "1.37rem", // 21.92px
      textAlign: "left",
      fontSize: "1rem", // 16px
      padding: "1rem", // 16px
      borderBottom: "0.0625rem solid #D6D5D4", // 1px
      borderRight: "none",
    },
    pagination: {
      style: {
        marginTop: "-3.75rem", // -60px
        borderStyle: "solid",
        borderWidth: "0.0625rem", // 1px
        borderColor: "#D6D5D4",
        borderTopWidth: "0",
      },
    },
  },
};

export const getTableCustomStyle = (freezeFirstColumn = false) => ({
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
      minHeight: "3.5rem", // 56px
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
      borderTopWidth: "0.0625rem", // 1px
      borderTopColor: "#D6D5D4",
      backgroundColor: "#EEEEEE",
    },
  },
  headCells: {
    style: {
      "&:first-of-type": {
        ...(freezeFirstColumn && {
          borderLeftStyle: "solid",
          borderLeftWidth: "0.0625rem", // 1px
          borderLeftColor: "#D6D5D4",
          borderTopLeftRadius: "0.25rem", // 4px
          position: "sticky",
          left: 0,
          backgroundColor: "#EEEEEE",
          zIndex: 2,
        }),
      },
      "&:last-of-type": {
        borderLeftStyle: "solid",
        borderLeftWidth: "0.0625rem", // 1px
        borderLeftColor: "#D6D5D4",
        borderTopRightRadius: "0.25rem", // 4px
      },
      borderRightStyle: "solid",
      borderRightWidth: "0.0625rem", // 1px
      borderRightColor: "#D6D5D4",
      fontFamily: "Roboto",
      fontWeight: "700",
      fontStyle: "normal",
      fontSize: "1rem", // 16px
      color: "#0B4B66",
      padding: "1rem", // 16px
      lineHeight: "1.14rem", // 18.24px
    },
  },
  cells: {
    style: {
      "&:first-of-type": {
        ...(freezeFirstColumn && {
          borderLeftStyle: "solid",
          borderLeftWidth: "0.0625rem", // 1px
          borderLeftColor: "#D6D5D4",
          position: "sticky",
          left: 0,
          backgroundColor: "#FFFFFF",
          zIndex: 1,
          boxShadow: "0.125rem 0 0.3125rem rgba(0, 0, 0, 0.1)", // 2px 0 5px
        }),
      },
      borderRightStyle: "solid",
      borderRightWidth: "0.0625rem", // 1px
      borderRightColor: "#D6D5D4",
      color: "#363636",
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "1.37rem", // 21.92px
      textAlign: "left",
      fontSize: "1rem", // 16px
      padding: "1rem", // 16px
    },
    pagination: {
      style: {
        marginTop: "-3.75rem", // -60px
        borderStyle: "solid",
        borderWidth: "0.0625rem", // 1px
        borderColor: "#D6D5D4",
        borderTopWidth: "0",
      },
    },
  },
});

