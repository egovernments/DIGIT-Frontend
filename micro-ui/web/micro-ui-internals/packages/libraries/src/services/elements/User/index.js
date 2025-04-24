import Urls from "../../atoms/urls";
import { Request, ServiceRequest } from "../../atoms/Utils/Request";
import { Storage } from "../../atoms/Utils/Storage";
// import { useKeycloak } from "../../../../../modules/core/src/context/Keycloakprovider";
export const UserService = {
  
  // const { keycloak } = useKeycloak();

  authenticate: async(details) => {
    const data = new URLSearchParams();
    
    // console.log("logout",keycloak);
    Object.entries(details).forEach(([key, value]) => data.append(key, value));
    data.append("scope", "read");
    data.append("grant_type", "password");
    
    let authResponse= await ServiceRequest({
      serviceName: "authenticate",
      url: Urls.Authenticate,
      data,
      headers: {
        authorization: `Basic ${window?.globalConfigs?.getConfig("JWT_TOKEN")||"ZWdvdi11c2VyLWNsaWVudDo="}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
      const invalidRoles = window?.globalConfigs?.getConfig("INVALIDROLES") || [];
      if (invalidRoles && invalidRoles.length > 0 && authResponse && authResponse?.UserRequest?.roles?.some((role) => invalidRoles.includes(role.code))) {
        throw new Error("ES_ERROR_USER_NOT_PERMITTED");
      }
      return authResponse;
  },
  logoutUser: (keycloak) => {
    const tenantId = Digit.ULBService.getStateId();
    keycloak.logout({
      redirectUri: `${window.location.origin}/sandbox-ui/${tenantId}/employee/user/language-selection`, // where to go after logout
    });
    // let user = UserService.getUser();
    // if (!user || !user.info || !user.access_token) return false;
    // const { type } = user.info;
    // return ServiceRequest({
    //   serviceName: "logoutUser",
    //   url: Urls.UserLogout,
    //   data: { access_token: user?.access_token },
    //   auth: true,
    //   params: { tenantId: type === "CITIZEN" ? Digit.ULBService.getStateId() : Digit.ULBService.getCurrentTenantId() },
    // });
  },
  getType: () => {
    return Storage.get("userType") || "citizen";
  },
  setType: (userType) => {
    Storage.set("userType", userType);
    Storage.set("user_type", userType);
  },
  getUser: () => {
    console.log("user",Digit.SessionStorage.get("User"))
    return Digit.SessionStorage.get("User");

  },
  logout: async (keycloak) => {
    const userType = UserService.getType();
    try {
      await UserService.logoutUser(keycloak);
    } catch (e) {
    }
    finally{
      window.localStorage.clear();
      window.sessionStorage.clear();
      if (userType === "citizen") {
        window.location.replace(`/${window?.contextPath}/citizen`);
      } else {
        window.location.replace(`/${window?.contextPath}/employee/user/language-selection`);
      }
    }
  },
  sendOtp: (details, stateCode) =>
    ServiceRequest({
      serviceName: "sendOtp",
      url: Urls.OTP_Send,
      data: details,
      auth: false,
      params: { tenantId: stateCode },
    }),
  setUser: (data) => {
    return Digit.SessionStorage.set("User", data);
  },
  setExtraRoleDetails: (data) => {
    const userDetails = Digit.SessionStorage.get("User");
    return Digit.SessionStorage.set("User", { ...userDetails, extraRoleInfo: data });
  },
  getExtraRoleDetails: () => {
    return Digit.SessionStorage.get("User")?.extraRoleInfo;
  },
  registerUser: (details, stateCode) =>
    ServiceRequest({
      serviceName: "registerUser",
      url: Urls.RegisterUser,
      data: {
        User: details,
      },
      params: { tenantId: stateCode },
    }),
  updateUser: async (details, stateCode) =>
    ServiceRequest({
      serviceName: "updateUser",
      url: Urls.UserProfileUpdate,
      auth: true,
      data: {
        user: details,
      },
      params: { tenantId: stateCode },
    }),
  hasAccess: (accessTo) => {
    const user = Digit.UserService.getUser();
    if (!user || !user.info) return false;
    const { roles } = user.info;
    return roles && Array.isArray(roles) && roles.filter((role) => accessTo.includes(role.code)).length;
  },

  changePassword: (details, stateCode) =>
    ServiceRequest({
      serviceName: "changePassword",
      url: Digit.SessionStorage.get("User")?.info ? Urls.ChangePassword1 : Urls.ChangePassword,
      data: {
        ...details,
      },
      auth: true,
      params: { tenantId: stateCode },
    }),

  employeeSearch: (tenantId, filters) => {
    return Request({
      url: Urls.EmployeeSearch,
      params: { tenantId, ...filters },
      auth: true,
    });
  },
  userSearch: async (tenantId, data, filters) => {
    // return ServiceRequest({
    //   url: Urls.UserSearch,
    //   params: { ...filters },
    //   method: "POST",
    //   auth: true,
    //   useCache: true,
    //   userService: true,
    //   data: data.pageSize ? { tenantId, ...data } : { tenantId, ...data, pageSize: "100" },
    // });


    const userResponse = {
      "responseInfo": {
        "apiId": null,
        "ver": null,
        "ts": null,
        "resMsgId": null,
        "msgId": null,
        "status": "200"
      },
      "user": [
        {
          "id": 39509,
          "userName": "tenant123@gmail.com",
          "salutation": null,
          "name": "sdfg",
          "gender": null,
          "mobileNumber": "9999999999",
          "emailId": "tenant123@gmail.com",
          "altContactNumber": null,
          "pan": null,
          "aadhaarNumber": null,
          "permanentAddress": null,
          "permanentCity": null,
          "permanentPinCode": null,
          "correspondenceAddress": null,
          "correspondenceCity": null,
          "correspondencePinCode": null,
          "alternatemobilenumber": null,
          "active": true,
          "locale": null,
          "type": "EMPLOYEE",
          "accountLocked": false,
          "accountLockedDate": 0,
          "fatherOrHusbandName": null,
          "relationship": null,
          "signature": null,
          "bloodGroup": null,
          "photo": null,
          "identificationMark": null,
          "createdBy": 128,
          "lastModifiedBy": 128,
          "tenantId": "SDFG",
          "roles": [
            {
              "code": "SUPERUSER",
              "name": "Super User",
              "tenantId": "SDFG"
            }
          ],
          "uuid": "fafdb4f8-4aa0-4325-9283-3299e35d4910",
          "createdDate": "17-01-2025 16:29:29",
          "lastModifiedDate": "17-01-2025 16:29:29",
          "dob": null,
          "pwdExpiryDate": "17-04-2025 16:29:25"
        }
      ]
    }


    // console.log("abcd",abcd)
    return userResponse;
  },
};
