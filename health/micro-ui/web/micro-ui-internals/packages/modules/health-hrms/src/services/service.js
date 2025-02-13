import { HRMS_CONSTANTS } from "../constants/constants";
const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "MICROPLAN";

//  Do the search employee API call
//  to check the existance of the user with given the employeeId

export const checkIfUserExist = async (data, tenantId) => {
  try {
    debugger;
    if (data?.SelectEmployeeId?.code && data?.SelectEmployeeId?.code?.trim().length > 0) {
      const result = await Digit.HRMSService.search(tenantId, null, { codes: data?.SelectEmployeeId?.code });
      debugger;
      if (result?.Employees?.length > 0) {
        return true; // User exists, return false
      } else {
        return false; // Success
      }
    } else {
      return true; // Success
    }
  } catch (error) {
    throw error; // throw on error
  }
};

export const formPayloadToCreateUser = (data, tenantId) => {
  const mappedroles = [].concat.apply([], data?.RolesAssigned);
  let createdAssignments = [
    {
      fromDate: new Date(data?.SelectDateofEmployment?.dateOfAppointment).getTime(),
      toDate: undefined,
      isCurrentAssignment: true,
      department: data?.SelectEmployeeDepartment?.code || HRMS_CONSTANTS.DEFAULT_DEPARTMENT,
      designation: data?.SelectEmployeeDesignation?.code || "undefined",
    },
  ];
  let Employees = [
    {
      tenantId: tenantId,
      employeeStatus: "EMPLOYED",
      assignments: createdAssignments,
      code: data?.SelectEmployeeId?.code,
      dateOfAppointment: new Date(data?.SelectDateofEmployment?.dateOfAppointment).getTime(),
      employeeType: data?.SelectEmployeeType?.code,
      jurisdictions: formJuridiction(data, tenantId),
      user: {
        mobileNumber: data?.SelectEmployeePhoneNumber?.mobileNumber?.startsWith(HRMS_CONSTANTS.INDIA_COUNTRY_CODE)
          ? data?.SelectEmployeePhoneNumber?.mobileNumber?.substring(HRMS_CONSTANTS.INDIA_COUNTRY_CODE.length)
          : (data?.SelectEmployeePhoneNumber?.mobileNumber?.startsWith(HRMS_CONSTANTS.MOZ_COUNTRY_CODE)
              ? data?.SelectEmployeePhoneNumber?.mobileNumber?.substring(HRMS_CONSTANTS.MOZ_COUNTRY_CODE.length)
              : data?.SelectEmployeePhoneNumber?.mobileNumber) || null,
        name: data?.SelectEmployeeName?.employeeName,
        correspondenceAddress: data?.SelectEmployeeCorrespondenceAddress?.correspondenceAddress || null,
        emailId: data?.SelectEmployeeEmailId?.emailId ? data?.SelectEmployeeEmailId?.emailId : null,
        gender: data?.SelectEmployeeGender?.gender.code,
        dob: new Date(data?.SelectDateofBirthEmployment?.dob || HRMS_CONSTANTS.DEFAULT_DOB).getTime(),
        roles: mappedroles,
        tenantId: tenantId,
        userName: data?.SelectEmployeeId?.code,
        password: data?.SelectEmployeePassword?.employeePassword,
      },
      serviceHistory: [],
      education: [],
      tests: [],
    },
  ];

  debugger
  return Employees;
};

function formJuridiction(data, tenantId) {
  debugger;
  let jurisdictions = {
    hierarchy: hierarchyType,
    boundaryType: "COUNTRY",
    boundary: "MICROPLAN_MO",
    tenantId: tenantId,
    roles: [].concat.apply([], data?.RolesAssigned),
  };

  return [jurisdictions];
}
