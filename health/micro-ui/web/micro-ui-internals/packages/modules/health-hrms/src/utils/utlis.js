/* methid to get date from epoch */
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
      case "TradeName":
        return /^[-@.\/#&+\w\s]*$/;
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
      case "PropertyID":
        return /^[a-zA-z0-9\s\\/\-]$/i;
      case "ElectricityConnNo":
        return /^.{1,15}$/i;
      case "DocumentNo":
        return /^[0-9]{1,15}$/i;
      case "eventName":
        return /^[^\$\"<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”]{1,65}$/i;
      case "eventDescription":
        return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,500}$/i;
      case "cancelChallan":
        return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,100}$/i;
      case "FireNOCNo":
        return /^[a-zA-Z0-9-]*$/i;
      case "consumerNo":
        return /^[a-zA-Z0-9/-]*$/i;
      case "AadharNo":
        return /^([0-9]){12}$/;
      case "ChequeNo":
        return /^(?!0{6})[0-9]{6}$/;
      case "Comments":
        return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,50}$/i;
      case "OldLicenceNo":
        return /^[a-zA-Z0-9-/]{0,64}$/;
      case "bankAccountNo":
        return /^\d{9,18}$/;
      case "IFSC":
        return /^[A-Z]{4}0[A-Z0-9]{6}$/;
      case "ApplicationNo":
        return /^[a-zA-z0-9\s\\/\-]$/i;
      case "Password":
        return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%])(?=\S+$).{8,15}$/;
      case "MozMobileNo":
        return /^[0-9]{9}$/i;
    }
  };