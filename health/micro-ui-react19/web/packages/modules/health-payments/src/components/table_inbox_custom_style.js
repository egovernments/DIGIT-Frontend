export const tableCustomStyle = (isInbox = false) => ({
  tableWrapper: {
    style: {
      minHeight: "fit-content",
      // Remove padding and border styles here if necessary
    },
  },
  table: {
    style: {
      // Remove any outer border styling here
    },
  },
  responsiveWrapper: {
    style: {
      // Remove overflow or border styling if needed
    },
  },
  contextMenu: {
    style: {
      // Remove border styling if needed
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
        borderLeftWidth: isInbox ? "0px" : "1px",
        borderLeftColor: "#D6D5D4",
        borderTopLeftRadius: "0.25rem",
      },
      "&:last-of-type": {
        borderRightStyle: "solid",
        borderRightWidth: isInbox ? "0px" : "1px",
        borderRightColor: "#D6D5D4",
        borderTopRightRadius: "0.25rem",
      },
      borderRightStyle: "solid",
      borderRightWidth: "0px",
      borderRightColor: "#D6D5D4",
      fontFamily: "Roboto",
      fontWeight: "700",
      fontStyle: "normal",
      fontSize: "16px",
      color: "#0B4B66",
      padding: "16px 0px 16px 16px",
      lineHeight: "1.14rem",
      zIndex: 10,
    },
  },
  cells: {
    style: {
      "&:first-of-type": {
        borderLeftStyle: "solid",
        borderLeftWidth: isInbox ? "0px" : "1px",
        borderLeftColor: "#D6D5D4",
      },
      "&:last-of-type": {
        borderRightStyle: "solid",
        borderRightWidth: isInbox ? "0px" : "1px",
        borderRightColor: "#D6D5D4",
        borderTopRightRadius: "0rem",
      },
      borderRightStyle: "solid",
      borderRightWidth: "0px",
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
        borderWidth: "0px",
        borderColor: "#D6D5D4",
        borderTopWidth: "0px",
        padding: "10px",
        // Ensure there's no outer border for pagination
      },
    },
  },
});


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



// INFO:: need to enhance the custom tabe style for edit attendee

export const editAttendeetableCustomStyle = (isInbox = false) => ({
  tableWrapper: {
    style: {
      minHeight: "fit-content",
      // Remove padding and border styles here if necessary
    },
  },
  table: {
    style: {
      // Remove any outer border styling here
    },
  },
  responsiveWrapper: {
    style: {
      // Remove overflow or border styling if needed
    },
  },
  contextMenu: {
    style: {
      // Remove border styling if needed
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
        borderLeftWidth: isInbox ? "0px" : "1px",
        borderLeftColor: "#D6D5D4",
        borderTopLeftRadius: "0.25rem",
      },
      "&:last-of-type": {
        borderRightStyle: "solid",
        borderRightWidth: isInbox ? "0px" : "1px",
        borderRightColor: "#D6D5D4",
        borderTopRightRadius: "0.25rem",
      },
      borderRightStyle: "solid",
      borderRightWidth: "0px",
      borderRightColor: "#D6D5D4",
      fontFamily: "Roboto",
      fontWeight: "700",
      fontStyle: "normal",
      fontSize: "16px",
      color: "#0B4B66",
      padding: "16px 0px 16px 16px",
      lineHeight: "1.14rem",
      zIndex: 10,
    },
  },
  cells: {
    style: {
      "&:first-of-type": {
        borderLeftStyle: "solid",
        borderLeftWidth: isInbox ? "0px" : "1px",
        borderLeftColor: "#D6D5D4",
      },
      "&:last-of-type": {
        borderRightStyle: "solid",
        borderRightWidth: isInbox ? "0px" : "1px",
        borderRightColor: "#D6D5D4",
        borderTopRightRadius: "0rem",
      },
      borderRightStyle: "solid",
      borderRightWidth: "0px",
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
        borderWidth: "0px",
        borderColor: "#D6D5D4",
        borderTopWidth: "0px",
        padding: "10px",
        // Ensure there's no outer border for pagination
      },
    },
  },
});