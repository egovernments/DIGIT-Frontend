// import React, { useEffect } from "react";
// import { Card, Banner, CardText, SubmitBar, Loader, LinkButton, ActionBar } from "@egovernments/digit-ui-react-components";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// const GetMessage = (type, action, isSuccess, isEmployee, t) => {
//   return t(`EMPLOYEE_RESPONSE_${action ? action : "CREATE"}_${type}${isSuccess ? "" : "_ERROR"}`);
// };

// const GetActionMessage = (action, isSuccess, isEmployee, t) => {
//   return GetMessage("ACTION", action, isSuccess, isEmployee, t);
// };

// const GetLabel = (action, isSuccess, isEmployee, t) => {
//   if (isSuccess) {
//     return t("HR_EMPLOYEE_ID_LABEL");
//   }
//   // return GetMessage("LABEL", action, isSuccess, isEmployee, t);
// };

// const BannerPicker = (props) => {
//   return (
//     <Banner
//       message={GetActionMessage(props.action, props.isSuccess, props.isEmployee, props.t)}
//       applicationNumber={props.isSuccess?props?.data?.Employees?.[0]?.code:''}
//       info={GetLabel(props.action, props.isSuccess, props.isEmployee, props.t)}
//       successful={props.isSuccess}
//     />
//   );
// };

// const Response = (props) => {
//   const { t } = useTranslation();
//   const tenantId = Digit.ULBService.getCurrentTenantId();
//   const stateId = Digit.ULBService.getStateId();
//   const { state } = props.location;
//   const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_HAPPENED", false);
//   const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_SUCCESS_DATA", false);
//   const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_ERROR_DATA", false);
//   const mutation = state.key === "UPDATE" ? Digit.Hooks.hrms.useHRMSUpdate(tenantId) : Digit.Hooks.hrms.useHRMSCreate(tenantId);

//   const employeeCreateSession = Digit.Hooks.useSessionStorage("NEW_EMPLOYEE_CREATE", {});
//   const [sessionFormData,setSessionFormData, clearSessionFormData] = employeeCreateSession;

//   // remove session form data if user navigates away from the estimate create screen
//   useEffect(()=>{
//     if (!window.location.href.includes("/hrms/create") && sessionFormData && Object.keys(sessionFormData) != 0) {
//     clearSessionFormData();
//     }
// },[location]);

//   const onError = (error, variables) => {
//     setErrorInfo(error?.response?.data?.Errors[0]?.code || 'ERROR');
//     setMutationHappened(true);
//   };

//   useEffect(() => {
//     if (mutation.data) setsuccessData(mutation.data);
//   }, [mutation.data]);

//   useEffect(() => {
//     const onSuccess = () => {
//       setMutationHappened(true);
//     };
//     if (!mutationHappened ) {
//       if (state.key === "UPDATE") {
//         mutation.mutate(
//           {
//             Employees: state.Employees,
//           },
//           {
//             onError,
//             onSuccess,
//           }
//         );
//       } else {
//         mutation.mutate(state, {
//           onSuccess,
//         });
//       }
//     }
//   }, []);

//   const DisplayText = (action, isSuccess, isEmployee, t) => {
//     if (!isSuccess) {
//       return mutation?.error?.response?.data?.Errors[0].code||errorInfo;
//     } else {
//       Digit.SessionStorage.set("isupdate", Math.floor(100000 + Math.random() * 900000));
//       return state.key === "CREATE"?"HRMS_CREATE_EMPLOYEE_INFO" :"";
//     }
//   };
//     if (mutation.isLoading || (mutation.isIdle && !mutationHappened)) {
//     return <Loader />;
//   }
//   return (
//     <Card>
//       <BannerPicker
//         t={t}
//         data={mutation?.data|| successData}
//         action={state.action}
//         isSuccess={!successData ? mutation?.isSuccess : true}
//         isLoading={(mutation.isIdle && !mutationHappened) || mutation?.isLoading}
//         isEmployee={props.parentRoute.includes("employee")}
//       />
//       <CardText>{t(DisplayText(state.action, mutation.isSuccess || !!successData, props.parentRoute.includes("employee"), t), t)}</CardText>

//       <ActionBar>
//         <Link to={`${props.parentRoute.includes("employee") ?  `/${window?.contextPath}/employee` :  `/${window?.contextPath}/citizen`}`}>
//           <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
//         </Link>
//       </ActionBar>
//     </Card>
//   );
// };

// export default Response;

// import React, { useState, Fragment } from "react";
// import { Link, useHistory, useLocation } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { Banner, Card, LinkLabel, AddFileFilled, ArrowLeftWhite, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
// import { PanelCard } from "@egovernments/digit-ui-components";

// const buttonStyle = {
//   wrapper: { display: "flex" },
//   linkLabel: { display: "flex", marginRight: "3rem" },
//   arrow: { marginRight: "8px", marginTop: "3px" },
// };

// const Response = () => {
//   const { t } = useTranslation();
//   const history = useHistory();
//   const queryStrings = Digit.Hooks.useQueryParams();
//   const [isResponseSuccess, setIsResponseSuccess] = useState(
//     queryStrings?.isSuccess === "true" ? true : queryStrings?.isSuccess === "false" ? false : true
//   );
//   const { state } = useLocation();

//   const navigate = (page) => {
//     switch (page) {
//       case "home": {
//         history.push(`/${window.contextPath}/employee`);
//       }
//     }
//   };

//   const children = (
//     <div style={buttonStyle?.wrapper}>
//       <LinkLabel style={buttonStyle?.linkLabel} onClick={() => navigate("home")}>
//         <ArrowLeftWhite fill="#c84c0e" style={buttonStyle?.arrow} />
//         {t("CORE_COMMON_GO_TO_HOME")}
//       </LinkLabel>
//     </div>
//   );

//   console.log("response")

//   return (
//     <>
//       <PanelCard
//         type={isResponseSuccess ? "success" : "error"}
//         message={t(state?.message || "SUCCESS")}
//         response={`${state?.showID ? state?.id : ""}`}
//         footerChildren={[]}
//         children={state?.showChildren ? children : null}
//       />
//       <ActionBar>
//         <Link to={`/${window.contextPath}/employee`}>
//           <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
//         </Link>
//       </ActionBar>
//     </>
//   );
// };

// export default Response;

// import React, { useState, Fragment } from "react";

// import { Link, useHistory, useLocation } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { 
//   Banner, 
//   Card, 
//   ActionBar, 
//   SubmitBar, 
//   Toast 
// } from "@egovernments/digit-ui-react-components";

// const Response = () => {
//   const { t } = useTranslation();
//   const history = useHistory();
//   const queryStrings = Digit.Hooks.useQueryParams();
//   const { state } = useLocation();
//   const { email} = location.state || {};

//   const [isResponseSuccess, setIsResponseSuccess] = useState(
//     queryStrings?.isSuccess === "true"
//   );

//   // Input States
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [toast, setToast] = useState({ show: false, message: "", error: false });

//   const navigate = (page) => {
//     if (page === "home") {
//       history.push(`/${window.contextPath}/employee`);
//     }
//   };
//   console.log("em",state?.id,state?.email)
//   const handleSubmit = async () => {
//     const accessToken = localStorage.getItem("token");
//     if (!username || !password) {
//       setToast({ show: true, message: "Username and Password are required", error: true });
//       return;
//     }

//     console.log("em",state?.email)

//     const requestBody = {
//       username,
//       email:  state?.email, 
//       enabled: true,
//       firstName: state?.name,
//       lastName:  "User",
//       attributes: {
//         mobileNumber:  "7898765432",
//       },
//       credentials: [
//         {
//           type: "password",
//           value: password,
//         },
//       ],
//     };
//     console.log("after submit")

//     try {
//       const url = 'http://localhost:8081/admin/realms/SDFG/users'
//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (response.ok) {
//         setToast({ show: true, message: "User created successfully!", error: false });
//       } else {
//         const errorData = await response.json();
//         setToast({ show: true, message: errorData?.error || "Failed to create user", error: true });
//       }
//     } catch (error) {
//       setToast({ show: true, message: "An error occurred while creating user", error: true });
//     }
//   };

//   return (
//     <>
//       {toast.show && <Toast label={toast.message} error={toast.error} onClose={() => setToast({ show: false })} />}
      
//       <Banner
//         message={isResponseSuccess ? "Employee created fill below info for user!" : "User creation failed"}
//         info={state?.id || ""}
//         successful={isResponseSuccess}
//       />

//       {/* Input Fields */}
//       <Card style={{ padding: "1rem", marginTop: "1rem" }}>
//         <label>Username</label>
//         <input 
//           type="text" 
//           value={username} 
//           onChange={(e) => setUsername(e.target.value)} 
//           required 
//           style={{ width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
//         />
        
//         <label>Password</label>
//         <input 
//           type="password" 
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//           required 
//           style={{ width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
//         />
//           {/* <SubmitBar disabled={!bill.totalAmount?.toFixed(2)} onSubmit={onSubmit} label={t("CS_MY_APPLICATION_VIEW_DETAILS")} /> */}
//         <SubmitBar label={t("Submit")} onSubmit={handleSubmit} />
//       </Card>

//       <ActionBar>
//         <Link to={`/${window.contextPath}/employee`}>
//           <SubmitBar label={t("Go to Home")} />
//         </Link>
//       </ActionBar>
//     </>
//   );
// };

// export default Response;

import React, { useState, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Banner,
  Card,
  ActionBar,
  SubmitBar,
  Toast,
} from "@egovernments/digit-ui-react-components";

const Response = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryStrings = Digit.Hooks.useQueryParams();
  const { state } = useLocation();
  const { email } = location.state || {};

  const [isResponseSuccess, setIsResponseSuccess] = useState(queryStrings?.isSuccess === "true");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", error: false });

  const navigate = (page) => {
    if (page === "home") {
      history.push(`/${window.contextPath}/employee`);
    }
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("token");
    if (!username || !password) {
      setToast({ show: true, message: "Username and Password are required", error: true });
      return;
    }

    const requestBody = {
      username,
      email: state?.email,
      enabled: true,
      firstName: state?.name,
      lastName: "User",
      attributes: {
        mobileNumber: "7898765432",
      },
      credentials: [
        {
          type: "password",
          value: password,
        },
      ],
    };

    try {
      // Create user
      const createUserResponse = await fetch("https://digit-lts.digit.org/keycloak-test/keycloak/admin/realms/SDFG/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!createUserResponse.ok) {
        const errorData = await createUserResponse.json();
        setToast({ show: true, message: errorData?.error || "Failed to create user", error: true });
        return;
      }

      // Search for the user to get UUID
      const searchUserResponse = await fetch(
        `https://digit-lts.digit.org/keycloak-test/keycloak/admin/realms/SDFG/users?username=${username}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!searchUserResponse.ok) {
        setToast({ show: true, message: "Failed to fetch user after creation", error: true });
        return;
      }

      const users = await searchUserResponse.json();
      const foundUser = users?.find((u) => u.username === username);

      if (!foundUser) {
        setToast({ show: true, message: "User not found after creation", error: true });
        return;
      }

      // Call the mapIndividualToUser API
      const mapResponse = await fetch("https://digit-lts.digit.org/individual/v1/_mapIndividualToUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          Individual: {
            id: state?.id,
            tenantId: "SDFG",
            userUuid: foundUser.id,
          },
          RequestInfo: {
            apiId: "Rainmaker",
            authToken: accessToken,
          },
        }),
      });

      if (mapResponse.ok) {
        setToast({ show: true, message: "User created and mapped successfully!", error: false });
      } else {
        const errorData = await mapResponse.json();
        setToast({ show: true, message: errorData?.error || "Failed to map user", error: true });
      }
    } catch (error) {
      setToast({ show: true, message: "An error occurred during user creation", error: true });
    }
  };

  return (
    <>
      {toast.show && <Toast label={toast.message} error={toast.error} onClose={() => setToast({ show: false })} />}

      {/* <Banner
        message={
          isResponseSuccess
            ? "Employee created fill below info for user!"
            : "User creation failed"
        }
        info={state?.id || ""}
        successful={isResponseSuccess}
      /> */}

    <h2 style={{ marginTop: "1rem", fontWeight: "bold" }}>User login setup</h2>

      <Card style={{ padding: "1rem", marginTop: "1rem" }}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        <SubmitBar label={t("Submit")} onSubmit={handleSubmit} />
      </Card>

      <ActionBar>
        <Link to={`/${window.contextPath}/employee`}>
          <SubmitBar label={t("Go to Home")} />
        </Link>
      </ActionBar>
    </>
  );
};

export default Response;

