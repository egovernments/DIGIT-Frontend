import { HRMS_CONSTANTS } from "../constants/constants";
const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "MICROPLAN";
import { convertEpochToDate } from "../utils/utlis";

//  Do the search employee API call
//  to check the existance of the user with given the employeeId

export const checkIfUserExist = async (data, tenantId) => {
  try {
   
    if (data?.SelectEmployeeId?.code && data?.SelectEmployeeId?.code?.trim().length > 0) {
      const result = await Digit.HRMSService.search(tenantId, null, { codes: data?.SelectEmployeeId?.code });
     
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




export const editDefaultUserValue=(data,tenantId)=>{
  debugger
const defaultValues = {
    tenantId: tenantId,
    employeeStatus: "EMPLOYED",
    employeeType: data[0]?.code,
    SelectEmployeePhoneNumber: { mobileNumber: data[0]?.user?.mobileNumber },
    SelectEmployeeId: { code: data[0]?.code },
    SelectEmployeeName: { employeeName: data[0]?.user?.name },
    SelectEmployeeEmailId: { emailId: data[0]?.user?.emailId },
    SelectEmployeeCorrespondenceAddress: { correspondenceAddress: data[0]?.user?.correspondenceAddress },
    SelectDateofEmployment: { dateOfAppointment: convertEpochToDate(data[0]?.dateOfAppointment) },
    SelectEmployeeType: { code: data[0]?.employeeType, active: true },
    SelectEmployeeDepartment: { code: data?.assignments?.[0]?.department, active: true },
    SelectEmployeeDesignation: { code: data?.assignments?.[0]?.designation, active: true },
    SelectEmployeeGender: {
      gender: {
        code: data[0]?.user?.gender,
        name: `COMMON_GENDER_${data[0]?.user?.gender}`,
      },
    },

    SelectDateofBirthEmployment: { dob: convertEpochToDate(data[0]?.user?.dob) },
    Jurisdictions: data[0]?.jurisdictions.map((ele, index) => {
      console.log("ele", ele);  
      return Object.assign({}, ele, {
        key: index,
        hierarchy: {
          code: ele.hierarchy,
          name: ele.hierarchy,
        },
        boundaryType: ele.boundaryType,
        boundary: ele.boundary ,
        roles: data[0]?.user?.roles.filter((item) => item.tenantId == tenantId),
      });
    }),
    Assignments: data[0]?.assignments.map((ele, index) => {
      return Object.assign({}, ele, {
        key: index,
        fromDate: convertEpochToDate(ele.fromDate),
        toDate: convertEpochToDate(ele.toDate),
        isCurrentAssignment: ele.isCurrentAssignment,
        designation: {
          code: (ele.designation !== "undefined" && ele.designation) ? ele.designation.split(HRMS_CONSTANTS.COLON)[0] : ele.designation,
          i18key: "COMMON_MASTERS_DESIGNATION_" + ele.designation,
        },
        department: {
          code: ele.department,
          i18key: "COMMON_MASTERS_DEPARTMENT_" + ele.department,
        },
      });
    }),
    selectedProject: null, 
    fromDate: null, 
    toDate: null 
  };

  return defaultValues;
}