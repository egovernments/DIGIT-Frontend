export const convertEpochToDate = (dateEpoch) => {
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

export const convertDateToEpoch = (dateString) => {
  const date = new Date(dateString);
  return Math.floor(date.getTime());
};

export const getPasswordPattern = () => /^[a-zA-Z0-9@#$%]{8,15}$/i;

export const getPattern = (type) => {
  switch (type) {
    case "Name":
      return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;""'']{1,50}$/i;
    case "SearchOwnerName":
      return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;""'']{3,50}$/i;
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
      return /^[^\$\"<>?\\\\~`!@$%^()+={}\[\]*:;""'']{1,300}$/i;
    case "PAN":
      return /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/i;
    case "Date":
      return /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/i;
    case "Password":
      return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%])(?=\S+$).{8,15}$/;
    case "MozMobileNo":
      return /^[0-9]{9}$/i;
    default:
      return null;
  }
};

export const editAttendeetableCustomStyle = (isInbox = false) => ({
  tableWrapper: { style: { minHeight: "fit-content" } },
  table: { style: {} },
  responsiveWrapper: { style: {} },
  contextMenu: { style: {} },
  header: { style: { minHeight: "40px" } },
  rows: {
    style: {
      backgroundColor: "#FFFFFF",
      "&:hover": { backgroundColor: "#FBEEE8" },
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
      },
    },
  },
});
