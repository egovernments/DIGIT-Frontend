

import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
// import { useHistory } from "react-router-dom";
import { FormComposerV2, Header } from "@egovernments/digit-ui-react-components";
// import { newConfig } from "../../../configs/IndividualCreateConfig";
import { newConfig } from "../../../config/individualConfig";
// import { transformIndividualCreateData } from "../../../utils/createUtils";
import { transformIndividualCreateData } from "../../../config/individualTransform";
import jwt_decode from "jwt-decode"; // Ensure this is installed: npm install jwt-decode
import { useKeycloak } from "../../../context/Keycloakprovider";
import { useHistory } from "react-router-dom";
// import { newConfig } from "../../configs/IndividualCreateConfig";
// import { transformIndividualCreateData } from "../../utils/createUtils";


const setCitizenDetail = (userObject, token, tenantId) => {
  // if (Digit.Utils.getMultiRootTenant()) {
  //   return;
  // }
  let locale = JSON.parse(sessionStorage.getItem("Digit.initData"))?.value?.selectedLanguage;
  localStorage.setItem("Citizen.tenant-id", tenantId);
  localStorage.setItem("tenant-id", tenantId);
  localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
  localStorage.setItem("locale", locale);
  localStorage.setItem("Citizen.locale", locale);
  localStorage.setItem("token", token);
  localStorage.setItem("Citizen.token", token);
  localStorage.setItem("user-info", JSON.stringify(userObject));
  localStorage.setItem("Citizen.user-info", JSON.stringify(userObject));
};

const CuccessPage = () => {
  const tenantId = "SDFG";
  const { t } = useTranslation();
  const history = useHistory();
  const { keycloak } = useKeycloak();
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  // const [userDetails, setUserDetails] = useState(null); // To store user API response
  const isLogin =false;
  const [newToken, setNewToken] = useState(null);
  const [individualExists, setIndividualExists] = useState(false);

  useEffect(() => {
    if (keycloak.token) {
      const decodedToken = jwt_decode(keycloak.token);
      setUsername(decodedToken?.preferred_username || "Unknown User");
    }
  }, [keycloak.token]); 
  
  useEffect(() => {
    if (keycloak.token) {
      fetchnewttoken();
    }
  }, [keycloak.token]);

  const decodedToken = newToken ? jwt_decode(newToken.access_token) : null;

    const individualSearchCriteria = {
    url: "/individual/v1/_search",
    params: {
      tenantId: "SDFG",
      offset: 0,
      limit: 10,
    },
    body: {
      Individual: {
        userUuid: [decodedToken?.sub], // User's UUID from Keycloak token
      },
      Pagination: {
        offSet: 0,
        limit: 10,
      },
      apiOperation: "SEARCH",
    },
    config: {
      enabled: newToken !==null && decodedToken !== null, // Enable only if user UUID exists
    },
  };

  // Fetch individual details using Digit API hook
  const { isLoading,data: individualData,isFetching, refetch } = Digit.Hooks.useCustomAPIHook(individualSearchCriteria);

    useEffect(()=>{
    if (individualData?.TotalCount > 0) {
      setIndividualExists(true);
      onSubmit();
    }
  },[individualData])

  useEffect(() => {
    if (!user) {
      return;
    }
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    const filteredRoles = user?.info?.roles?.filter((role) => role.tenantId === Digit.SessionStorage.get("Employee.tenantId"));
    if (user?.info?.roles?.length > 0) user.info.roles = filteredRoles;
    Digit.UserService.setUser(user);
    setCitizenDetail(user?.info, user?.access_token, "SDFG");
    // setEmployeeDetail(user?.info, user?.access_token);
    // let redirectPath = `/${window?.globalPath}/user/setup`;
    let redirectPath = `/${window?.contextPath}/citizen/select-location`;
    history.push({
      pathname: redirectPath,
      state: { tenant: "SDFG" },
    });
    // if (isLogin) {
    //   // history.push(redirectPathOtpLogin);
    //   return;
    // } else {
    //   return;
    //   history.push({
    //     pathname: redirectPath,
    //     state: { tenant: "SDFG" },
    //   });
      // return;
    // }
    return
  }, [user]);

  const fetchnewttoken = async () => {
    if ( !keycloak.token) {
      console.error("Username or access token not available!");
      return;
    }

    const url = `https://digit-lts.digit.org/keycloak-test/realms/SDFG/protocol/openid-connect/token`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${keycloak.token}`, // Pass the token in the Authorization header
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
          audience: "auth-server",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response of new token :", data);
      setNewToken(data); // Set the new access token from the response
      localStorage.setItem("newAccessToken", data?.access_token); // Store the new token in localStorage
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const reqCreate = {
    url: `/individual/v1/_create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);


  const onSubmit = async(data) => {
    if ( !newToken) {
      console.error("User details or Keycloak tokens are not available!");
      return;
    }
    const de = jwt_decode(newToken.access_token);

    if(individualExists==false){
    console.log(data, "data");
    await mutation.mutate(
      {
        url: `/individual/v1/_create`,
        params: { tenantId },
        body: transformIndividualCreateData(data,de.sub),
        config: {
          enable: true,
        },
      },
    );
  }
   
  
    try {
      const decodedToken = jwt_decode(newToken.access_token);
        const info = {
          uuid: decodedToken.sub,
          userName: decodedToken.preferred_username,
          name: decodedToken.name || "N/A",
          emailId: decodedToken.email || "N/A",
          mobileNumber: "7879180998",
          type:"CITIZEN",
          roles: decodedToken.realm_access?.roles.map((role) => ({
            name: role,
            code: role.toUpperCase(),
            tenantId: "SDFG",
          })) || [],
          active: true,
          tenantId: "SDFG",
        };
      console.log("token check",newToken.expires_in)
      const tokens = {
        access_token: newToken.access_token, // Get access token from Keycloak
        refresh_token: newToken.refresh_token, // Get refresh token from Keycloak
        expires_in: newToken.expires_in, // Calculate remaining expiry time in seconds
        scope: "read",
        ResponseInfo: {
          api_id: "",
          ver: "",
          ts: "",
          res_msg_id: "",
          msg_id: "",
          status: "Access Token generated successfully",
        },
      };
  
      Digit.SessionStorage.set("Employee.tenantId", info?.tenantId);
      setUser({ info, ...tokens });
    } catch (err) {
      console.error("Error setting user details:", err);
    }

  //   console.log(data, "data");
  //   if(individualExists==false){
  //   await mutation.mutate(
  //     {
  //       url: `/individual/v1/_create`,
  //       params: { tenantId },
  //       body: transformIndividualCreateData(data,de.sub),
  //       config: {
  //         enable: true,
  //       },
  //     },
  //   );
  // }
  //   let redirectPath = `/${window?.contextPath}/citizen/select-location`;
  //   history.push({
  //     pathname: redirectPath,
  //     state: { tenant: "SDFG" },
  //   });
  };
  return (
    <div>
      <Header>{t("User Profile")}</Header>
      {individualExists ? (
        <button onClick={onSubmit}>{t("PROFILE_ALREADY_SET")}</button>
      ) : (
        <FormComposerV2
          label={t("SUBMIT_BUTTON")}
          config={newConfig.map((config) => ({ ...config }))}
          defaultValues={{}}
          onFormValueChange={(
            setValue,
            formData,
            formState,
            reset,
            setError,
            clearErrors,
            trigger,
            getValues
          ) => {
            console.log(formData, "formData");
          }}
          onSubmit={(data) => onSubmit(data)}
          fieldStyle={{ marginRight: 0 }}
        />
      )}
    </div>
  );
}

export default CuccessPage;



// import React, { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { useHistory } from "react-router-dom";
// import { FormComposerV2, Header } from "@egovernments/digit-ui-react-components";
// import { newConfig } from "../../../config/individualConfig";
// import { transformIndividualCreateData } from "../../../config/individualTransform";
// import jwt_decode from "jwt-decode";
// import { useKeycloak } from "../../../context/Keycloakprovider";


// const setCitizenDetail = (userObject, token, tenantId) => {
//   let locale = JSON.parse(sessionStorage.getItem("Digit.initData"))?.value?.selectedLanguage;
//   localStorage.setItem("Citizen.tenant-id", tenantId);
//   localStorage.setItem("tenant-id", tenantId);
//   localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
//   localStorage.setItem("locale", locale);
//   localStorage.setItem("Citizen.locale", locale);
//   localStorage.setItem("token", token);
//   localStorage.setItem("Citizen.token", token);
//   localStorage.setItem("user-info", JSON.stringify(userObject));
//   localStorage.setItem("Citizen.user-info", JSON.stringify(userObject));
// };
// const CuccessPage = () => {
//   const tenantId = "SDFG";
//   const { t } = useTranslation();
//   const history = useHistory();
//   const { keycloak } = useKeycloak();
//   const [user, setUser] = useState(null);
//   const [newToken, setNewToken] = useState(null);
//   const [individualExists, setIndividualExists] = useState(false);
//   useEffect(() => {
//     if (keycloak.token) {
//       fetchNewToken();
//     }
//   }, [keycloak.token]);
//   // useEffect(() => {
//   //   if (newToken) {
//   //     checkIndividualExists();
//   //   }
//   // }, [newToken]);
//   const fetchNewToken = async () => {
//     try {
//       const response = await fetch("http://localhost:8081/realms/SDFG/protocol/openid-connect/token", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${keycloak.token}`,
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//           grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
//           audience: "auth-server",
//         }),
//       });
//       if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
//       const data = await response.json();
//       setNewToken(data);
//       localStorage.setItem("newAccessToken", data?.access_token);
//     } catch (error) {
//       console.error("Error fetching new token:", error);
//     }
//   };

//   const decodedToken = newToken ? jwt_decode(newToken.access_token) : null;
//   const individualSearchCriteria = {
//     url: "/individual/v1/_search",
//     params: {
//       tenantId: "SDFG",
//       offset: 0,
//       limit: 10,
//     },
//     // changeQueryName: decodedToken?.sub, // Unique identifier for caching API response
//     body: {
//       Individual: {
//         userUuid: [decodedToken?.sub], // User's UUID from Keycloak token
//       },
//       Pagination: {
//         offSet: 0,
//         limit: 10,
//       },
//       apiOperation: "SEARCH",
//     },
//     config: {
//       enabled: newToken !==null && decodedToken !== null, // Enable only if user UUID exists
//     },
//   };

//   // Fetch individual details using Digit API hook
//   const { isLoading,data: individualData,isFetching, refetch } = Digit.Hooks.useCustomAPIHook(individualSearchCriteria);

//   useEffect(()=>{
//     if (individualData?.TotalCount > 0) {
//       setIndividualExists(true);
//       setUserDetailsAndRedirect(decodedToken);
//     }
//   },[individualData])

//   // const checkIndividualExists = async () => {
//   //   try {
//   //     if (!newToken) return;
  

//   //     console.log("inside function")
//   //     const decodedToken = jwt_decode(newToken.access_token);
//   //     console.log("token",decodedToken?.sub)
  
      
//   //     console.log(individualData,"individualData")
//   //     if (individualData?.TotalCount > 0) {
//   //       setIndividualExists(true);
//   //       setUserDetailsAndRedirect(decodedToken);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error checking individual existence:", error);
//   //   }
//   // };
  
//   const setUserDetailsAndRedirect = (decodedToken) => {
//     const info = {
//       uuid: decodedToken.sub,
//       userName: decodedToken.preferred_username,
//       name: decodedToken.name || "N/A",
//       emailId: decodedToken.email || "N/A",
//       mobileNumber: "7879180998",
//       type: "CITIZEN",
//       roles: decodedToken.realm_access?.roles.map((role) => ({
//         name: role,
//         code: role.toUpperCase(),
//         tenantId,
//       })) || [],
//       active: true,
//       tenantId,
//     };
//     setCitizenDetail(info, newToken.access_token, tenantId);
//     history.push({ pathname: `/${window?.contextPath}/citizen/select-location`, state: { tenant: tenantId } });
//   };
//   const onSubmit = async (data) => {
//     if (!newToken) return;
//     const decodedToken = jwt_decode(newToken.access_token);
//     try {
//       await Digit.Hooks.useCustomAPIMutationHook({
//         url: `/individual/v1/_create`,
//         params: { tenantId },
//         body: transformIndividualCreateData(data, decodedToken.sub),
//         config: { enable: true },
//       }).mutate();
//       setUserDetailsAndRedirect(decodedToken);
//     } catch (err) {
//       console.error("Error creating individual:", err);
//     }
//   };
//   if (individualExists) {
//     return <p>{t("REDIRECTING_TO_LOCATION_SELECTION")}</p>;
//   }
//   return (
//     <div>
//       <Header>{t("CREATE_INDIVIDUAL")}</Header>
//       <FormComposerV2
//         label={t("SUBMIT_BUTTON")}
//         config={newConfig}
//         defaultValues={{}}
//         onFormValueChange={(setValue, formData) => console.log(formData)}
//         onSubmit={onSubmit}
//         fieldStyle={{ marginRight: 0 }}
//       />
//     </div>
//   );
// };
// export default CuccessPage;