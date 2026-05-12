import { HRMS_CONSTANTS } from "../constants/constants";
const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "HIERARCHYTEST";
import { convertEpochToDate } from "../utils/utlis";
import employeeDetailsFetch from "./FetchEmployeeDetails";
import HrmsService from "./hrms/HRMSService";

/**
 * Checks if a user exists with the given phone number.
 * Calls the HRMS service to search for employees based on phone number.
 * @param {Object} data - The form data containing phone number.
 * @param {string} tenantId - The tenant ID.
 * @returns {boolean} - True if user exists, false otherwise.
 */
export const checkIfUserExistWithPhoneNumber = async (data, tenantId) => {
  try {

    //  if (data?.SelectEmployeePhoneNumber && data?.SelectEmployeePhoneNumber?.trim().length > 0) {
    const result = await HrmsService.search(tenantId, null, { phone: data?.SelectEmployeePhoneNumber });

    if (result?.Employees?.length > 0) {
      return true; // User exists, return false
    } else {
      return false; // Success
    }
  } catch (error) {
    throw error; // throw on error
  }
};

/**
 * Checks if a user exists with the given employee ID.
 * Calls the HRMS service to search for employees based on the provided employee ID.
 *
 * @param {Object} data - The form data containing the employee ID.
 * @param {string} tenantId - The tenant ID.
 * @returns {boolean} - Returns true if the user exists, otherwise false.
 * @throws {Error} - Throws an error if the API request fails.
 */

export const checkIfUserExist = async (data, tenantId) => {
  try {
    if (data?.SelectEmployeeId && data?.SelectEmployeeId?.trim().length > 0) {
      const result = await HrmsService.search(tenantId, null, { codes: data?.SelectEmployeeId })

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

/**
 * Creates a payload for adding a new employee/user.
 * This function formats the given data into a structure that the HRMS system expects.
 *
 * @param {Object} data - The form data containing employee details.
 * @param {string} tenantId - The tenant ID.
 * @returns {Array} - Returns an array containing the new employee data payload.
 */
export const formPayloadToCreateUser = (data, tenantId) => {
  const mappedroles = [].concat.apply([], data?.RolesAssigned);
  let createdAssignments = [
    {
      fromDate: new Date(data?.SelectDateofEmployment).getTime(),
      toDate: undefined,
      isCurrentAssignment: true,
      department: data?.SelectEmployeeDepartment?.code || HRMS_CONSTANTS.DEFAULT_DEPARTMENT,
      designation: data?.SelectEmployeeDesignation?.code || "undefined",
      reportingTo: data?.UserAssignment || "undefined"
    },
  ];

  let Employees = [
    {
      tenantId: tenantId,
      employeeStatus: "EMPLOYED",
      assignments: createdAssignments,
      code: data?.SelectEmployeeId,
      dateOfAppointment: new Date(data?.SelectDateofEmployment).getTime(),
      employeeType: data?.SelectEmployeeType?.code,
      jurisdictions: formJuridiction(data, tenantId),
      user: {
        mobileNumber: data?.SelectEmployeePhoneNumber?.startsWith(HRMS_CONSTANTS.INDIA_COUNTRY_CODE)
          ? data?.SelectEmployeePhoneNumber?.substring(HRMS_CONSTANTS.INDIA_COUNTRY_CODE.length)
          : (data?.SelectEmployeePhoneNumber?.startsWith(HRMS_CONSTANTS.MOZ_COUNTRY_CODE)
            ? data?.SelectEmployeePhoneNumber?.substring(HRMS_CONSTANTS.MOZ_COUNTRY_CODE.length)
            : data?.SelectEmployeePhoneNumber) || null,
        name: data?.SelectEmployeeName,
        correspondenceAddress: data?.SelectEmployeeCorrespondenceAddress || null,
        emailId: data?.SelectEmployeeEmailId ? data?.SelectEmployeeEmailId : null,

        gender: data?.gender.code,
        dob: new Date(data?.SelectDateofBirthEmployment || HRMS_CONSTANTS.DEFAULT_DOB).getTime(),
        roles: mappedroles,
        tenantId: tenantId,
        userName: data?.SelectEmployeeId,
        password: data?.employeePassword,
      },
      serviceHistory: [],
      education: [],
      tests: [],
    },
  ];

  return Employees;
};

/**
 * Creates a payload for updating an existing employee/user.
 * This function formats the given data and merges it with existing user data.
 *
 * @param {Object} data - The form data containing updated employee details.
 * @param {Array} userExisting - The existing user data.
 * @param {string} tenantId - The tenant ID.
 * @returns {Array} - Returns an array containing the updated employee data payload.
 */

export const formPayloadToUpdateUser = (data, userExisting, tenantId) => {
  let requestdata = Object.assign({}, userExisting[0]);
  let roles = [].concat.apply([], data?.RolesAssigned);

  requestdata.dateOfAppointment = new Date(data?.SelectDateofEmployment).getTime();
  requestdata.code = data?.SelectEmployeeId ? data?.SelectEmployeeId : undefined;
  requestdata.jurisdictions = userExisting[0].jurisdictions

  requestdata.assignments = userExisting[0].assignments.map((j) => {
    let assigment = { ...j };
    assigment.department = data?.SelectEmployeeDepartment?.code || j.department;
    assigment.designation = data?.SelectEmployeeDesignation?.code || j.designation;

    return assigment;
  });

  requestdata.employeeType = data?.SelectEmployeeType?.code;

  requestdata.user = requestdata.user || {};
  requestdata.user.emailId = data?.SelectEmployeeEmailId != null && data?.SelectEmployeeEmailId !== "" ? data?.SelectEmployeeEmailId : userExisting[0]?.user?.emailId;
  requestdata.user.gender = data?.gender.code;
  requestdata.user.dob = new Date(data?.SelectDateofBirthEmployment || HRMS_CONSTANTS.DEFAULT_DOB).getTime();

  requestdata.user.mobileNumber = data?.SelectEmployeePhoneNumber?.startsWith(HRMS_CONSTANTS.INDIA_COUNTRY_CODE)
    ? data?.SelectEmployeePhoneNumber?.substring(HRMS_CONSTANTS.INDIA_COUNTRY_CODE.length)
    : (data?.SelectEmployeePhoneNumber?.startsWith(HRMS_CONSTANTS.MOZ_COUNTRY_CODE)
      ? data?.SelectEmployeePhoneNumber?.substring(HRMS_CONSTANTS.MOZ_COUNTRY_CODE.length)
      : data?.SelectEmployeePhoneNumber) || null;

  requestdata.user.name = data?.SelectEmployeeName;
  requestdata.user.correspondenceAddress = data?.SelectEmployeeCorrespondenceAddress || null;
  requestdata.user.roles = roles.filter((role) => role && role.name);

  if (userExisting && userExisting.length > 0) {
    requestdata.id = userExisting[0]?.id || null;
    requestdata.uuid = userExisting[0]?.uuid || null;
  }

  return [requestdata];
};

/**
 * Creates jurisdiction data for an employee based on the given form data.
 * This function formats the jurisdiction details required for the employee record.
 *
 * @param {Object} data - The form data containing jurisdiction-related information.
 * @param {string} tenantId - The tenant ID.
 * @returns {Array} - Returns an array containing the jurisdiction details.
 */

function formJuridiction(data, tenantId) {
  const boundaries = data?.Jurisdictions || [];
  const jurisdictions = boundaries.map((boundary) => ({
    hierarchy: boundary?.hierarchyType,
    boundaryType: boundary?.boundaryType,
    boundary: boundary?.code,
    tenantId: tenantId,
    roles: [].concat.apply([], data?.RolesAssigned),
  }));

  return jurisdictions;
}


/**
 * Edits and formats the default values for an employee/user.
 * This function extracts necessary details from the given data and prepares an object
 * with structured default values, making it suitable for pre-filling forms.
 *
 * @param {Array} data - The user data containing employee details.
 * @param {string} tenantId - The tenant ID.
 * @returns {Object} - An object containing formatted default values.
 */

export const editDefaultUserValue = (data, tenantId) => {
  const defaultValues = {
    tenantId: tenantId || "",
    employeeStatus: "EMPLOYED",
    employeeType: data[0]?.code || "",
    SelectEmployeePhoneNumber: data[0]?.user?.mobileNumber || "",
    SelectEmployeeId: data[0]?.code || "",
    SelectEmployeeName: data[0]?.user?.name || "",
    SelectEmployeeEmailId: data[0]?.user?.emailId || "",
    SelectEmployeeCorrespondenceAddress: data[0]?.user?.correspondenceAddress || "",
    SelectDateofEmployment: convertEpochToDate(data[0]?.dateOfAppointment) || "",
    SelectEmployeeType: { name: `EGOV_HRMS_EMPLOYEETYPE_${data[0]?.employeeType}`, code: data[0]?.employeeType || "", active: true },
    SelectEmployeeDepartment: {
      name: `COMMON_MASTERS_DEPARTMENT_${data[0]?.assignments?.[0]?.department}`,
      code: data[0]?.assignments?.[0]?.department || "",
      active: true,
    },
    SelectEmployeeDesignation: {
      name: `COMMON_MASTERS_DESIGNATION_${data[0]?.assignments?.[0]?.designation}`,
      code: data[0]?.assignments?.[0]?.designation || "",
      active: true,
    },

    gender: {
      active: true,
      code: data[0]?.user?.gender,
      name: `COMMON_GENDER_${data[0]?.user?.gender}`,
    },

    RolesAssigned: (data?.[0]?.user?.roles || []).map((e) => e),
    SelectDateofBirthEmployment: convertEpochToDate(data[0]?.user?.dob),
    Jurisdictions: data[0]?.jurisdictions?.map((ele) => ({
      boundaryType: ele.boundaryType,
      code: ele.boundary,
      hierarchy: ele.hierarchy,
    })),
    Assignments: data[0]?.assignments.map((ele, index) => {
      return Object.assign({}, ele, {
        key: index,
        fromDate: convertEpochToDate(ele.fromDate),
        toDate: convertEpochToDate(ele.toDate),
        isCurrentAssignment: ele.isCurrentAssignment,
        designation: {
          code: ele.designation !== "undefined" && ele.designation ? ele.designation.split(HRMS_CONSTANTS.COLON)[0] : ele.designation,
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
    toDate: null,
  };

  return defaultValues;
};

/**
 * Edits and formats the default values for assignment data.
 * This function processes assignment-related data, extracting necessary details and
 * returning an object suitable for pre-filling forms.
 *
 * @param {Array} data - The assignment data array.
 * @param {string} tenantId - The tenant ID.
 * @returns {Object} - An object containing formatted default assignment values.
 */

export const editDefaultAssignmentValue = (data, tenantId) => {
  const defaultValues = {
    CampaignsAssignment:
      data.length > 0
        ? data?.map((ele, index) => ({
          key: index,
          fromDate: ele.startDate ? convertEpochToDate(ele.startDate) : "",
          toDate: ele.endDate ? convertEpochToDate(ele.endDate) : "",
          selectedProject: { id: ele.projectId },
        }))
        : [
          {
            key: 0,
            fromDate: "",
            toDate: "",
            selectedProject: { id: "" },
          },
        ],
  };

  return defaultValues;
};

/**
 * Searches for staff members based on the provided criteria.
 * This function calls `employeeDetailsFetch` to retrieve staff details
 * related to a specific project or criteria.
 *
 * @param {Object} data - The search criteria, including filters.
 * @param {string} tenantId - The tenant ID for scoping the search.
 * @returns {Array|undefined} - Returns an array of staff under the project, or undefined if not found.
 * @throws {Error} - Throws an error if the request fails.
 */
export const searchStaff = async (data, tenantId) => {
  try {
    const result = await employeeDetailsFetch(data, tenantId);

    return result?.Project;
  } catch (error) {
    throw error; // throw on error
  }
};
