import { HRMS_CONSTANTS } from "../constants/constants";
import { convertEpochToDate } from "../utils/utlis";
import employeeDetailsFetch from "./FetchEmployeeDetails";
import HrmsService from "./hrms/HRMSService";

export const checkIfUserExistWithPhoneNumber = async (data, tenantId) => {
  try {
    const result = await HrmsService.search(tenantId, null, { phone: data?.SelectEmployeePhoneNumber });
    return result?.Employees?.length > 0;
  } catch (error) {
    throw error;
  }
};

export const checkIfUserExist = async (data, tenantId) => {
  try {
    if (data?.SelectEmployeeId && data?.SelectEmployeeId?.trim().length > 0) {
      const result = await HrmsService.search(tenantId, null, { codes: data?.SelectEmployeeId });
      return result?.Employees?.length > 0;
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export const formPayloadToCreateUser = (data, tenantId) => {
  const mappedroles = [].concat.apply([], data?.RolesAssigned);
  const createdAssignments = [
    {
      fromDate: new Date(data?.SelectDateofEmployment).getTime(),
      toDate: undefined,
      isCurrentAssignment: true,
      department: data?.SelectEmployeeDepartment?.code || HRMS_CONSTANTS.DEFAULT_DEPARTMENT,
      designation: data?.SelectEmployeeDesignation?.code || "undefined",
      reportingTo: data?.UserAssignment || "undefined",
    },
  ];

  const Employees = [
    {
      tenantId,
      employeeStatus: "EMPLOYED",
      assignments: createdAssignments,
      code: data?.SelectEmployeeId,
      dateOfAppointment: new Date(data?.SelectDateofEmployment).getTime(),
      employeeType: data?.SelectEmployeeType?.code,
      jurisdictions: formJuridiction(data, tenantId),
      user: {
        mobileNumber: data?.SelectEmployeePhoneNumber?.startsWith(HRMS_CONSTANTS.INDIA_COUNTRY_CODE)
          ? data?.SelectEmployeePhoneNumber?.substring(HRMS_CONSTANTS.INDIA_COUNTRY_CODE.length)
          : data?.SelectEmployeePhoneNumber?.startsWith(HRMS_CONSTANTS.MOZ_COUNTRY_CODE)
          ? data?.SelectEmployeePhoneNumber?.substring(HRMS_CONSTANTS.MOZ_COUNTRY_CODE.length)
          : data?.SelectEmployeePhoneNumber || null,
        name: data?.SelectEmployeeName,
        correspondenceAddress: data?.SelectEmployeeCorrespondenceAddress || null,
        emailId: data?.SelectEmployeeEmailId || null,
        gender: data?.gender.code,
        dob: new Date(data?.SelectDateofBirthEmployment || HRMS_CONSTANTS.DEFAULT_DOB).getTime(),
        roles: mappedroles,
        tenantId,
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

export const formPayloadToUpdateUser = (data, userExisting, tenantId) => {
  let requestdata = Object.assign({}, userExisting[0]);
  const roles = [].concat.apply([], data?.RolesAssigned);

  requestdata.dateOfAppointment = new Date(data?.SelectDateofEmployment).getTime();
  requestdata.code = data?.SelectEmployeeId || undefined;
  requestdata.jurisdictions = userExisting[0].jurisdictions;
  requestdata.assignments = userExisting[0].assignments.map((j) => ({
    ...j,
    department: data?.SelectEmployeeDepartment?.code || j.department,
    designation: data?.SelectEmployeeDesignation?.code || j.designation,
  }));
  requestdata.employeeType = data?.SelectEmployeeType?.code;
  requestdata.user = requestdata.user || {};
  requestdata.user.emailId =
    data?.SelectEmployeeEmailId != null && data?.SelectEmployeeEmailId !== ""
      ? data?.SelectEmployeeEmailId
      : userExisting[0]?.user?.emailId;
  requestdata.user.gender = data?.gender.code;
  requestdata.user.dob = new Date(data?.SelectDateofBirthEmployment || HRMS_CONSTANTS.DEFAULT_DOB).getTime();
  requestdata.user.mobileNumber = data?.SelectEmployeePhoneNumber?.startsWith(HRMS_CONSTANTS.INDIA_COUNTRY_CODE)
    ? data?.SelectEmployeePhoneNumber?.substring(HRMS_CONSTANTS.INDIA_COUNTRY_CODE.length)
    : data?.SelectEmployeePhoneNumber?.startsWith(HRMS_CONSTANTS.MOZ_COUNTRY_CODE)
    ? data?.SelectEmployeePhoneNumber?.substring(HRMS_CONSTANTS.MOZ_COUNTRY_CODE.length)
    : data?.SelectEmployeePhoneNumber || null;
  requestdata.user.name = data?.SelectEmployeeName;
  requestdata.user.correspondenceAddress = data?.SelectEmployeeCorrespondenceAddress || null;
  requestdata.user.roles = roles.filter((role) => role && role.name);

  if (userExisting && userExisting.length > 0) {
    requestdata.id = userExisting[0]?.id || null;
    requestdata.uuid = userExisting[0]?.uuid || null;
  }

  return [requestdata];
};

function formJuridiction(data, tenantId) {
  const boundaries = data?.Jurisdictions || [];
  return boundaries.map((boundary) => ({
    hierarchy: boundary?.hierarchyType,
    boundaryType: boundary?.boundaryType,
    boundary: boundary?.code,
    tenantId,
    roles: [].concat.apply([], data?.RolesAssigned),
  }));
}

export const editDefaultUserValue = (data, tenantId) => ({
  tenantId: tenantId || "",
  employeeStatus: "EMPLOYED",
  employeeType: data[0]?.code || "",
  SelectEmployeePhoneNumber: data[0]?.user?.mobileNumber || "",
  SelectEmployeeId: data[0]?.code || "",
  SelectEmployeeName: data[0]?.user?.name || "",
  SelectEmployeeEmailId: data[0]?.user?.emailId || "",
  SelectEmployeeCorrespondenceAddress: data[0]?.user?.correspondenceAddress || "",
  SelectDateofEmployment: convertEpochToDate(data[0]?.dateOfAppointment) || "",
  SelectEmployeeType: {
    name: `EGOV_HRMS_EMPLOYEETYPE_${data[0]?.employeeType}`,
    code: data[0]?.employeeType || "",
    active: true,
  },
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
  Assignments: data[0]?.assignments.map((ele, index) =>
    Object.assign({}, ele, {
      key: index,
      fromDate: convertEpochToDate(ele.fromDate),
      toDate: convertEpochToDate(ele.toDate),
      isCurrentAssignment: ele.isCurrentAssignment,
      designation: {
        code:
          ele.designation !== "undefined" && ele.designation
            ? ele.designation.split(HRMS_CONSTANTS.COLON)[0]
            : ele.designation,
        i18key: "COMMON_MASTERS_DESIGNATION_" + ele.designation,
      },
      department: {
        code: ele.department,
        i18key: "COMMON_MASTERS_DEPARTMENT_" + ele.department,
      },
    })
  ),
  selectedProject: null,
  fromDate: null,
  toDate: null,
});

export const editDefaultAssignmentValue = (data, tenantId) => ({
  CampaignsAssignment:
    data.length > 0
      ? data?.map((ele, index) => ({
          key: index,
          fromDate: ele.startDate ? convertEpochToDate(ele.startDate) : "",
          toDate: ele.endDate ? convertEpochToDate(ele.endDate) : "",
          selectedProject: { id: ele.projectId },
        }))
      : [{ key: 0, fromDate: "", toDate: "", selectedProject: { id: "" } }],
});

export const searchStaff = async (data, tenantId) => {
  try {
    const result = await employeeDetailsFetch(data, tenantId);
    return result?.Project;
  } catch (error) {
    throw error;
  }
};
