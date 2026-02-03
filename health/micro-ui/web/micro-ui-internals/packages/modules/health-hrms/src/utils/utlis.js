/* method to get date from epoch */
export const convertEpochToDate = (dateEpoch) => {
    // Returning null in else case because new Date(null) returns initial date from calender
    if (dateEpoch) {
        const dateFromApi = new Date(dateEpoch);
        let month = dateFromApi.getMonth() + 1;
        let day = dateFromApi.getDate();
        let year = dateFromApi.getFullYear();
        month = (month > 9 ? "" : "0") + month;
        day = (day > 9 ? "" : "0") + day;
        return `${year}-${month}-${day}`;
    } else {
        return null;
    }
};

export const convertDateToEpoch= (dateString) => {
    // Create a Date object from the input date string
    const date = new Date(dateString);

    // Convert the date to epoch time (seconds)
    return Math.floor(date.getTime());
}
export const getPasswordPattern = () => {
    return /^[a-zA-Z0-9@#$%]{8,15}$/i
}


export const getPattern = (type) => {
    switch (type) {
      case "Name":
        return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i;
      case "SearchOwnerName":
        return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{3,50}$/i;
      case "MobileNo":
        return /^[6789][0-9]{9}$/i;
      case "Amount":
        return /^[0-9]{0,8}$/i;
      case "NonZeroAmount":
        return /^[1-9][0-9]{0,7}$/i;
      case "DecimalNumber":
        return /^\d{0,8}(\.\d{1,2})?$/i;
      case "Email":
        return /^(?=^.{1,64}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/i;
      case "Address":
        return /^[^\$\"<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,300}$/i;
      case "PAN":
        return /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/i;
      case "Date":
        return /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/i;
      case "UOMValue":
        return /^(0)*[1-9][0-9]{0,5}$/i;
      case "OperationalArea":
        return /^(0)*[1-9][0-9]{0,6}$/i;
      case "NoOfEmp":
        return /^(0)*[1-9][0-9]{0,6}$/i;
      case "GSTNo":
        return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/i;
      case "DoorHouseNo":
        return /^[^\$\"'<>?~`!@$%^={}\[\]*:;“”‘’]{1,50}$/i;
      case "BuildingStreet":
        return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,64}$/i;
      case "Pincode":
        return /^[1-9][0-9]{5}$/i;
      case "Landline":
        return /^[0-9]{11}$/i;
      case "DocumentNo":
        return /^[0-9]{1,15}$/i;
      case "AadharNo":
        return /^([0-9]){12}$/;
      case "Comments":
        return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,50}$/i;
      case "bankAccountNo":
        return /^\d{9,18}$/;
      case "IFSC":
        return /^[A-Z]{4}0[A-Z0-9]{6}$/;
      case "ApplicationNo":
        return /^[a-zA-Z0-9\s\\/-]$/i;
      case "Password":
        return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%])(?=\S+$).{8,15}$/;
      case "MozMobileNo":
        return /^[0-9]{9}$/i;
    }
  };




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
      padding: "12px 8px",
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
      fontSize: "15px",
      padding: "8px 12px",
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
      minHeight: "40px",
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
      padding: "12px 8px",
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
      padding: "8px 12px",
    },
    pagination: {
      style: {
        marginTop: "-30px",
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