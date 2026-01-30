import {
  SVG,
  Dropdown,
  LabelFieldPair,
  MobileNumber,
  TextInput,
  CardLabelError,
  BackLink,
  Loader,
  Button,
  SubmitBar,
  Footer,
  CardLabel,
  BreadCrumb,
  Toast,
  ErrorMessage,
} from "@egovernments/digit-ui-components";
import { CameraIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import UploadDrawer from "./ImageUpload/UploadDrawer";
import ImageComponent from "../../../components/ImageComponent";

const DEFAULT_TENANT = Digit?.ULBService?.getStateId?.();

const defaultImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO4AAADUCAMAAACs0e/bAAAAM1BMVEXK0eL" +
  "/" +
  "/" +
  "/" +
  "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";

const defaultValidationConfig = {
  tenantId: `${DEFAULT_TENANT}`,
  UserProfileValidationConfig: [
    {
      name: "/^[a-zA-Z ]+$/i",
      mobileNumber: "/^[6-9]{1}[0-9]{9}$/",
      password: "/^([a-zA-Z0-9@#$%]{8,15})$/i",
    },
  ],
};

const UserProfile = ({ stateCode, userType, cityDetails }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const url = window.location.href;
  const stateId = Digit.ULBService.getStateId();
  const tenant = Digit.ULBService.getCurrentTenantId();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [userDetails, setUserDetails] = useState(null);
  const [name, setName] = useState(userInfo?.name ? userInfo.name : "");
  const [email, setEmail] = useState(userInfo?.emailId ? userInfo.emailId : "");
  const [gender, setGender] = useState(userDetails?.gender);
  const [city, setCity] = useState(userInfo?.permanentCity ? userInfo.permanentCity : cityDetails.name);
  const [mobileNumber, setMobileNo] = useState(userInfo?.mobileNumber ? userInfo.mobileNumber : "");
  const [profilePic, setProfilePic] = useState(null);
  const [profileImg, setProfileImg] = useState("");
  const [openUploadSlide, setOpenUploadSide] = useState(false);
  const [changepassword, setChangepassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [errors, setErrors] = React.useState({});
  const isMobile = window.Digit.Utils.browser.isMobile();
  const isMultiRootTenant = Digit.Utils.getMultiRootTenant();

  const mapConfigToRegExp = (config) => {
    return (
      config?.UserProfileValidationConfig?.[0] &&
      Object.entries(config?.UserProfileValidationConfig[0]).reduce((acc, [key, value]) => {
        if (typeof value === "string") {
          try {
            // Checking if value looks like a regex (starts with "/" and ends with "/flags")
            if (value.startsWith("/") && value.lastIndexOf("/") > 0) {
              const lastSlashIndex = value.lastIndexOf("/");
              const pattern = value.slice(1, lastSlashIndex); // Extracting regex pattern
              const flags = value.slice(lastSlashIndex + 1); // Extracting regex flags

              acc[key] = new RegExp(pattern, flags); // Converting properly
            } else {
              acc[key] = new RegExp(value); // Treating it as a normal regex pattern (no flags)
            }
          } catch (error) {
            console.error(`Error parsing regex for key "${key}":`, error);
            acc[key] = value; // Keeping as string if invalid regex
          }
        } else {
          acc[key] = value; // Keeping non-string values as it is
        }
        return acc;
      }, {})
    );
  };

  const [validationConfig, setValidationConfig] = useState(mapConfigToRegExp(defaultValidationConfig) || {});

  const { data: mdmsValidationData, isValidationConfigLoading } = Digit.Hooks.useCustomMDMS(
    stateCode,
    "commonUiConfig",
    [{ name: "UserProfileValidationConfig" }],
    {
      select: (data) => {
        return data?.commonUiConfig;
      },
    }
  );

  useEffect(() => {
    if (mdmsValidationData && mdmsValidationData?.UserProfileValidationConfig?.[0]) {
      const updatedValidationConfig = mapConfigToRegExp(mdmsValidationData);
      setValidationConfig(updatedValidationConfig);
    }
  }, [mdmsValidationData]);

  const getUserInfo = async () => {
    const uuid = userInfo?.uuid;
    const individualServicePath = window?.globalConfigs?.getConfig("INDIVIDUAL_SERVICE_CONTEXT_PATH");

    if (uuid) {
      if (individualServicePath) {
        // New API using health-individual
        const response = await Digit.CustomService.getResponse({
          url: `${individualServicePath}/v1/_search`,
          useCache: false,
          method: "POST",
          userService: true,
          params: {
            limit: 1000,
            offset: 0,
            tenantId: tenant,
          },
          body: {
            Individual: {
              userUuid: [uuid],
              tenantId: tenant,
            },
          },
        });

        if (response?.Individual?.length) {
          setUserDetails(response.Individual[0]);
        }
      } else {
        // Old API
        const usersResponse = await Digit.UserService.userSearch(tenant, { uuid: [uuid] }, {});
        if (usersResponse?.user?.length) {
          setUserDetails(usersResponse.user[0]);
        }
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
    return () => {
      window.removeEventListener("resize", () => setWindowWidth(window.innerWidth));
    };
  });

  useEffect(() => {
    setLoading(true);

    getUserInfo();

    setGender({
      i18nKey: undefined,
      code: userDetails?.gender,
      value: userDetails?.gender,
    });

    const thumbs = userDetails?.photo?.split(",");
    setProfileImg(thumbs?.at(0));

    setLoading(false);
  }, [userDetails !== null]);

  let validation = {};
  const editScreen = false; // To-do: Deubug and make me dynamic or remove if not needed
  const onClickAddPic = () => setOpenUploadSide(!openUploadSlide);
  const TogleforPassword = () => setChangepassword(!changepassword);
  const setGenderName = (value) => setGender(value);
  const closeFileUploadDrawer = () => setOpenUploadSide(false);

  const setUserName = (value) => {
    setName(value);

    if (!validationConfig?.name?.test(value) || value.length === 0 || value.length > 50) {
      setErrors({
        ...errors,
        userName: {
          type: "pattern",
          message: "CORE_COMMON_PROFILE_NAME_INVALID",
        },
      });
    } else {
      setErrors({ ...errors, userName: null });
    }
  };

  const setUserEmailAddress = (value) => {
    if (userInfo?.userName !== value) {
      setEmail(value);

      if (value.length && !(value.includes("@") && value.includes("."))) {
        setErrors({
          ...errors,
          emailAddress: {
            type: "pattern",
            message: "CORE_COMMON_PROFILE_EMAIL_INVALID",
          },
        });
      } else {
        setErrors({ ...errors, emailAddress: null });
      }
    } else {
      setErrors({ ...errors, emailAddress: null });
    }
  };

  const setUserMobileNumber = (value) => {
    setMobileNo(value);

    if (userType === "employee" && !validationConfig?.mobileNumber?.test(value)) {
      setErrors({
        ...errors,
        mobileNumber: {
          type: "pattern",
          message: "CORE_COMMON_PROFILE_MOBILE_NUMBER_INVALID",
        },
      });
    } else {
      setErrors({ ...errors, mobileNumber: null });
    }
  };

  const setUserCurrentPassword = (value) => {
    if (!validationConfig?.password.test(value)) {
      setErrors({
        ...errors,
        currentPassword: {
          type: "pattern",
          message: "CORE_COMMON_PROFILE_PASSWORD_INVALID",
        },
      });
    } else {
      setErrors({ ...errors, currentPassword: null });
    }
  };

  const setUserNewPassword = (value) => {
    setNewPassword(value);
    if (!validationConfig?.password.test(value)) {
      setErrors({
        ...errors,
        newPassword: {
          type: "pattern",
          message: "CORE_COMMON_PROFILE_PASSWORD_INVALID",
        },
      });
    } else {
      setErrors({ ...errors, newPassword: null });
    }
  };

  const setUserConfirmPassword = (value) => {
    setConfirmPassword(value);

    if (!validationConfig?.password.test(value)) {
      setErrors({
        ...errors,
        confirmPassword: {
          type: "pattern",
          message: "CORE_COMMON_PROFILE_PASSWORD_INVALID",
        },
      });
    } else {
      setErrors({ ...errors, confirmPassword: null });
    }
  };

  const removeProfilePic = () => {
    setProfilePic(null);
    setProfileImg(null);
  };

  const showToast = (type, message, duration = 5000) => {
    setToast({ key: type, action: message });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      if (name) {
        setName((prev) => prev.trim());
      }

      if (!validationConfig?.name.test(name) || name === "" || name.length > 50 || name.length < 1) {
        throw JSON.stringify({
          type: "error",
          message: t("CORE_COMMON_PROFILE_NAME_INVALID"),
        });
      }

      if (userType === "employee" && !validationConfig?.mobileNumber.test(mobileNumber)) {
        throw JSON.stringify({
          type: "error",
          message: t("CORE_COMMON_PROFILE_MOBILE_NUMBER_INVALID"),
        });
      }

      if (email.length && !(email.includes("@") && email.includes("."))) {
        throw JSON.stringify({
          type: "error",
          message: t("CORE_COMMON_PROFILE_EMAIL_INVALID"),
        });
      }

      const trimmedCurrentPassword = currentPassword.trim();
      const trimmedNewPassword = newPassword.trim();
      const trimmedConfirmPassword = confirmPassword.trim();

      setCurrentPassword(trimmedCurrentPassword);
      setNewPassword(trimmedNewPassword);
      setConfirmPassword(trimmedConfirmPassword);

      if (changepassword && (trimmedCurrentPassword && trimmedNewPassword && trimmedConfirmPassword)) {
        if (trimmedNewPassword !== trimmedConfirmPassword) {
          throw JSON.stringify({
            type: "error",
            message: t("CORE_COMMON_PROFILE_PASSWORD_MISMATCH"),
          });
        }

        if (!(trimmedCurrentPassword.length && trimmedNewPassword.length && trimmedConfirmPassword.length)) {
          throw JSON.stringify({
            type: "error",
            message: t("CORE_COMMON_PROFILE_PASSWORD_INVALID"),
          });
        }

        if (!validationConfig?.password.test(trimmedNewPassword) && !validationConfig?.password.test(trimmedConfirmPassword)) {
          throw JSON.stringify({
            type: "error",
            message: t("CORE_COMMON_PROFILE_PASSWORD_INVALID"),
          });
        }
      }

      let responseInfo;
      const individualServicePath = window?.globalConfigs?.getConfig("INDIVIDUAL_SERVICE_CONTEXT_PATH");

      if (individualServicePath) {
        // Build Individual object dynamically
        const individualPayload = {
          ...userDetails,
          tenantId: tenant,
          name: {
            givenName: name.trim(),
            familyName: userDetails?.name?.familyName,
            otherNames: userDetails?.name?.otherNames,
          },
          mobileNumber: mobileNumber,
          isDeleted: false,
          isSystemUser: true,
          isSystemUserActive: true,
        };

        // Only add optional fields if they have values
        if (gender?.value) {
          individualPayload.gender = gender.value;
        }

        if (email) {
          individualPayload.email = email;
        }

        if (profilePic) {
          individualPayload.photo = profilePic;
        }

        const response = await Digit.CustomService.getResponse({
          url: `${individualServicePath}/v1/_update`,
          useCache: false,
          method: "POST",
          userService: true,
          body: {
            Individual: individualPayload,
          },
        });
        responseInfo = response?.responseInfo;
      }
      else {
        // Old API
        const requestData = {
          ...userInfo,
          name,
          gender: gender?.value,
          emailId: email,
          photo: profilePic,
        };
        const response = await Digit.UserService.updateUser(requestData, stateCode);
        responseInfo = response?.responseInfo;
      }


      if (responseInfo && responseInfo.status === "200") {
        const user = Digit.UserService.getUser();

        if (user) {
          Digit.UserService.setUser({
            ...user,
            info: {
              ...user.info,
              name,
              mobileNumber,
              emailId: email,
              permanentCity: city,
            },
          });
        }
      }

      if (currentPassword.length && newPassword.length && confirmPassword.length) {
        const requestData = {
          existingPassword: currentPassword,
          newPassword: newPassword,
          tenantId: tenant,
          type: "EMPLOYEE",
          username: userInfo?.userName,
          confirmPassword: confirmPassword,
        };

        if (newPassword === confirmPassword) {
          try {
            const res = await Digit.UserService.changePassword(requestData, tenant);

            const { responseInfo: changePasswordResponseInfo } = res;
            if (changePasswordResponseInfo?.status && changePasswordResponseInfo.status === "200") {
              showToast("success", t("CORE_COMMON_PROFILE_UPDATE_SUCCESS_WITH_PASSWORD"), 5000);
              setTimeout(() => Digit.UserService.logout(), 2000);
            } else {
              throw "";
            }
          } catch (error) {
            throw JSON.stringify({
              type: "error",
              message: error.Errors?.at(0)?.description ? error.Errors.at(0).description : "CORE_COMMON_PROFILE_UPDATE_ERROR_WITH_PASSWORD",
            });
          }
        } else {
          throw JSON.stringify({
            type: "error",
            message: "CORE_COMMON_PROFILE_ERROR_PASSWORD_NOT_MATCH",
          });
        }
      } else if (responseInfo?.status && responseInfo.status === "200") {
        showToast("success", t("CORE_COMMON_PROFILE_UPDATE_SUCCESS"), 5000);
      }
    } catch (error) {
      let errorObj;
      try {
        errorObj = JSON.parse(error);
      } catch (e) {
        errorObj = {
          type: "error",
          message: error?.response?.data?.Errors?.[0]?.description || "CORE_COMMON_PROFILE_UPDATE_ERROR",
        };
      }
      showToast(errorObj.type, t(errorObj.message), 5000);
    }

    setLoading(false);
  };

  let menu = [];
  const { data: Menu } = Digit.Hooks.useGenderMDMS(stateId, "common-masters", "GenderType");
  Menu &&
    Menu.map((genderDetails) => {
      menu.push({
        i18nKey: `PT_COMMON_GENDER_${genderDetails.code}`,
        code: `${genderDetails.code}`,
        value: `${genderDetails.code}`,
      });
    });

  const setFileStoreId = async (fileStoreId) => {
    setProfilePic(fileStoreId);

    const thumbnails = fileStoreId ? await getThumbnails([fileStoreId], stateId) : null;

    setProfileImg(thumbnails?.thumbs[0]);

    closeFileUploadDrawer();
  };

  const getThumbnails = async (ids, tenantId) => {
    const res = await Digit.UploadServices.Filefetch(ids, tenantId);
    if (res.data.fileStoreIds && res.data.fileStoreIds.length !== 0) {
      return {
        thumbs: res.data.fileStoreIds.map((o) => o.url.split(",")[3]),
        images: res.data.fileStoreIds.map((o) => Digit.Utils.getFileUrl(o.url)),
      };
    } else {
      return null;
    }
  };

  if (loading || isValidationConfigLoading) return <Loader></Loader>;

  return (
    <div className={`user-profile ${userType === "citizen" ? "citizen" : "employee"}`}>
      <section style={{ margin: userType === "citizen" || isMobile ? "8px" : "0px" }}>
        {userType === "citizen" || isMobile ? (
          <BackLink onClick={() => navigate("/")} />
        ) : (
          <BreadCrumb
            style={{ marginTop: "0rem", marginBottom: "1.5rem" }}
            crumbs={[
              {
                internalLink: isMultiRootTenant ? `/${window?.contextPath}/employee/sandbox/landing` : `/${window?.contextPath}/employee`,
                content: t("ES_COMMON_HOME"),
                show: true,
              },
              {
                internalLink: `/${window?.contextPath}/employee/user/profile`,
                content: t("ES_COMMON_PAGE_1"),
                show: url.includes("/user/profile"),
              },
            ]}
          />
        )}
      </section>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: windowWidth < 768 || userType === "citizen" ? "column" : "row",
          margin: userType === "citizen" ? "8px" : "0px",
          gap: userType === "citizen" ? "" : "0 24px",
          boxShadow: userType === "citizen" ? "1px 1px 4px 0px rgba(0,0,0,0.2)" : "",
          background: userType === "citizen" ? "white" : "",
          borderRadius: userType === "citizen" ? "4px" : "",
          maxWidth: userType === "citizen" ? "960px" : "",
        }}
      >
        <section
          style={{
            position: "relative",
            display: "flex",
            flex: userType === "citizen" ? 1 : 2.5,
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "100%",
            // height: "376px",
            borderRadius: "4px",
            boxShadow: userType === "citizen" ? "" : "1px 1px 4px 0px rgba(0,0,0,0.2)",
            border: `${userType === "citizen" ? "8px" : "24px"} solid #fff`,
            background: "#EEEEEE",
            padding: userType === "citizen" ? "8px" : "16px",
          }}
        >
          <div
            style={{
              position: "relative",
              height: userType === "citizen" ? "114px" : "150px",
              width: userType === "citizen" ? "114px" : "150px",
              margin: "16px",
            }}
          >
            <ImageComponent
              style={{
                margin: "auto",
                borderRadius: "300px",
                justifyContent: "center",
                height: "100%",
                width: "100%",
              }}
              src={!profileImg || profileImg === "" ? defaultImage : profileImg}
              alt="Profile Image"
            />

            <button
              style={{
                position: "absolute",
                left: "50%",
                bottom: "-24px",
                transform: "translateX(-50%)",
              }}
              onClick={onClickAddPic}
            >
              <CameraIcon />
            </button>
          </div>
        </section>
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            flex: userType === "citizen" ? 1 : 7.5,
            width: "100%",
            borderRadius: "4px",
            height: "fit-content",
            boxShadow: userType === "citizen" ? "" : "1px 1px 4px 0px rgba(0,0,0,0.2)",
            background: "white",
            padding: userType === "citizen" ? "8px" : "24px",
            paddingBottom: "20px",
          }}
        >
          {userType === "citizen" ? (
            <React.Fragment>
              <LabelFieldPair>
                <CardLabel className="user-profile" style={editScreen ? { color: "#B1B4B6" } : {}}>
                  {`${t("CORE_COMMON_PROFILE_NAME")}`}*
                </CardLabel>
                <div style={{ width: "100%", maxWidth: "960px" }}>
                  <TextInput
                    t={t}
                    style={{ width: "100%" }}
                    type={"text"}
                    isMandatory={false}
                    name="name"
                    value={name}
                    onChange={(e) => setUserName(e.target.value)}
                    {...(validation = {
                      isRequired: true,
                      pattern:
                        mdmsValidationData?.UserProfileValidationConfig?.[0]?.name || defaultValidationConfig?.UserProfileValidationConfig?.[0]?.name,
                      type: "tel",
                      title: t("CORE_COMMON_PROFILE_NAME_ERROR_MESSAGE"),
                    })}
                    disable={editScreen}
                  />
                  {/* {errors?.userName && (
                    <CardLabelError>
                      {" "}
                      {t(errors?.userName?.message)}{" "}
                    </CardLabelError>
                  )} */}
                  {errors?.userName && (
                    <ErrorMessage
                      message={t(errors?.userName?.message)}
                      truncateMessage={true}
                      maxLength={256}
                      className=""
                      wrapperClassName=""
                      showIcon={true}
                    />
                  )}
                </div>
              </LabelFieldPair>

              <LabelFieldPair>
                <CardLabel className="user-profile" style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("CORE_COMMON_PROFILE_GENDER")}`}</CardLabel>
                <Dropdown
                  style={{ width: "100%", fontSize: "1rem" }}
                  className="form-field profileDropdown"
                  selected={gender?.length === 1 ? gender[0] : gender}
                  disable={gender?.length === 1 || editScreen}
                  option={menu}
                  select={setGenderName}
                  value={gender}
                  optionKey="code"
                  t={t}
                  name="gender"
                />
              </LabelFieldPair>

              <LabelFieldPair>
                <CardLabel className="user-profile" style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("CORE_COMMON_PROFILE_EMAIL")}`}</CardLabel>
                <div style={{ width: "100%" }}>
                  <TextInput
                    t={t}
                    style={{ width: "100%" }}
                    type={"email"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="email"
                    value={email}
                    onChange={(e) => setUserEmailAddress(e.target.value)}
                    disabled={editScreen}
                  />
                  {errors?.emailAddress && (
                    <ErrorMessage
                      message={t(errors?.emailAddress?.message)}
                      truncateMessage={true}
                      maxLength={256}
                      className=""
                      wrapperClassName=""
                      showIcon={true}
                    />
                  )}
                </div>
              </LabelFieldPair>

              <button
                onClick={updateProfile}
                style={{
                  marginTop: "24px",
                  backgroundColor: "#c84c0e",
                  width: "100%",
                  height: "40px",
                  color: "white",

                  maxWidth: isMobile ? "100%" : "240px",
                  borderBottom: "1px solid black",
                }}
              >
                {t("CORE_COMMON_SAVE")}
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <LabelFieldPair style={{ display: "flex" }}>
                <CardLabel className="profile-label-margin" style={editScreen ? { color: "#B1B4B6", width: "300px" } : { width: "300px" }}>
                  {`${t("CORE_COMMON_PROFILE_NAME")}`}*
                </CardLabel>
                <div style={{ width: "100%" }}>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    name="name"
                    value={name}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter Your Name"
                    {...(validation = {
                      isRequired: true,
                      pattern:
                        mdmsValidationData?.UserProfileValidationConfig?.[0]?.name || defaultValidationConfig?.UserProfileValidationConfig?.[0]?.name,
                      type: "text",
                      title: t("CORE_COMMON_PROFILE_NAME_ERROR_MESSAGE"),
                    })}
                    disabled={editScreen}
                  />
                  {errors?.userName && (
                    <ErrorMessage
                      message={t(errors?.userName?.message)}
                      truncateMessage={true}
                      maxLength={256}
                      className=""
                      wrapperClassName=""
                      showIcon={true}
                    />
                  )}
                </div>
              </LabelFieldPair>

              <LabelFieldPair style={{ display: "flex" }}>
                <CardLabel className="profile-label-margin" style={editScreen ? { color: "#B1B4B6", width: "300px" } : { width: "300px" }}>{`${t(
                  "CORE_COMMON_PROFILE_GENDER"
                )}`}</CardLabel>
                <div style={{ width: "100%" }}>
                  <Dropdown
                    className="profileDropdown"
                    selected={gender?.length === 1 ? gender[0] : gender}
                    disable={gender?.length === 1 || editScreen}
                    option={menu}
                    select={setGenderName}
                    value={gender}
                    optionKey="code"
                    t={t}
                    name="gender"
                  />
                </div>
              </LabelFieldPair>

              <LabelFieldPair style={{ display: "flex" }}>
                <CardLabel className="profile-label-margin" style={editScreen ? { color: "#B1B4B6", width: "300px" } : { width: "300px" }}>{`${t(
                  "CORE_COMMON_PROFILE_CITY"
                )}`}</CardLabel>
                <div style={{ width: "100%" }}>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    name="city"
                    value={t(Digit.Utils.locale.getTransformedLocale(`TENANT_TENANTS_${tenant}`))}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter Your City Name"
                    {...(validation = {
                      isRequired: true,
                      // pattern: "^[a-zA-Z-.`' ]*$",
                      type: "text",
                      title: t("CORE_COMMON_PROFILE_CITY_ERROR_MESSAGE"),
                    })}
                    disabled={true}
                  />
                  <ErrorMessage />
                </div>
              </LabelFieldPair>

              <LabelFieldPair style={{ display: "flex" }}>
                <CardLabel className="profile-label-margin" style={{ width: "300px" }}>{`${t("CORE_COMMON_PROFILE_MOBILE_NUMBER")}*`}</CardLabel>
                <div style={{ width: "100%" }}>
                  <MobileNumber
                    value={mobileNumber}
                    style={{ width: "100%" }}
                    name="mobileNumber"
                    placeholder="Enter a valid Mobile No."
                    onChange={(value) => setUserMobileNumber(value)}
                    disable={Digit.Utils.getMultiRootTenant() ? false : true}
                    {...{
                      required: true,
                      pattern:
                        mdmsValidationData?.UserProfileValidationConfig?.[0]?.mobileNumber ||
                        defaultValidationConfig?.UserProfileValidationConfig?.[0]?.mobileNumber,
                      type: "tel",
                      title: t("CORE_COMMON_PROFILE_MOBILE_NUMBER_INVALID"),
                    }}
                  />
                  {errors?.mobileNumber && (
                    <ErrorMessage
                      message={t(errors?.mobileNumber?.message)}
                      truncateMessage={true}
                      maxLength={256}
                      className=""
                      wrapperClassName=""
                      showIcon={true}
                    />
                  )}
                </div>
              </LabelFieldPair>

              <LabelFieldPair style={{ display: "flex" }}>
                <CardLabel className="profile-label-margin" style={editScreen ? { color: "#B1B4B6", width: "300px" } : { width: "300px" }}>{`${t(
                  "CORE_COMMON_PROFILE_EMAIL"
                )}`}</CardLabel>
                <div style={{ width: "100%" }}>
                  <TextInput
                    t={t}
                    type={"email"}
                    isMandatory={false}
                    placeholder={t("EMAIL_VALIDATION")}
                    optionKey="i18nKey"
                    name="email"
                    value={email}
                    onChange={(e) => setUserEmailAddress(e.target.value)}
                    disabled={Digit.Utils.getMultiRootTenant() ? true : editScreen}
                  />
                  {errors?.emailAddress && (
                    <ErrorMessage
                      message={t(errors?.emailAddress?.message)}
                      truncateMessage={true}
                      maxLength={256}
                      className=""
                      wrapperClassName=""
                      showIcon={true}
                    />
                  )}
                </div>
              </LabelFieldPair>

              <LabelFieldPair>
                <div style={{ width: "100%" }}>
                  {changepassword == false && !Digit.Utils.getOTPBasedLogin() ? (
                    <Button
                      label={t("CORE_COMMON_CHANGE_PASSWORD")}
                      variation={"teritiary"}
                      onClick={TogleforPassword}
                      style={{ paddingLeft: "20rem" }}
                    ></Button>
                  ) : null}
                  {changepassword ? (
                    <div style={{ marginTop: "10px" }}>
                      <LabelFieldPair style={{ display: "flex" }}>
                        <CardLabel
                          className="profile-label-margin"
                          style={editScreen ? { color: "#B1B4B6", width: "300px" } : { width: "300px" }}
                        >{`${t("CORE_COMMON_PROFILE_CURRENT_PASSWORD")}`}</CardLabel>
                        <div style={{ width: "100%" }}>
                          <TextInput
                            t={t}
                            type={"password"}
                            isMandatory={false}
                            name="name"
                            pattern={
                              mdmsValidationData?.UserProfileValidationConfig?.[0]?.password ||
                              defaultValidationConfig?.UserProfileValidationConfig?.[0]?.password
                            }
                            onChange={(e) => setUserCurrentPassword(e?.target?.value)}
                            disabled={editScreen}
                          />
                          {errors?.currentPassword && (
                            <ErrorMessage
                              message={t(errors?.currentPassword?.message)}
                              truncateMessage={true}
                              maxLength={256}
                              className=""
                              wrapperClassName=""
                              showIcon={true}
                            />
                          )}
                        </div>
                      </LabelFieldPair>

                      <LabelFieldPair style={{ display: "flex" }}>
                        <CardLabel
                          className="profile-label-margin"
                          style={editScreen ? { color: "#B1B4B6", width: "300px" } : { width: "300px" }}
                        >{`${t("CORE_COMMON_PROFILE_NEW_PASSWORD")}`}</CardLabel>
                        <div style={{ width: "100%" }}>
                          <TextInput
                            t={t}
                            type={"password"}
                            isMandatory={false}
                            name="name"
                            pattern={
                              mdmsValidationData?.UserProfileValidationConfig?.[0]?.password ||
                              defaultValidationConfig?.UserProfileValidationConfig?.[0]?.password
                            }
                            onChange={(e) => setUserNewPassword(e?.target?.value)}
                            disabled={editScreen}
                          />
                          {errors?.newPassword && (
                            <ErrorMessage
                              message={t(errors?.newPassword?.message)}
                              truncateMessage={true}
                              maxLength={256}
                              className=""
                              wrapperClassName=""
                              showIcon={true}
                            />
                          )}
                        </div>
                      </LabelFieldPair>

                      <LabelFieldPair style={{ display: "flex" }}>
                        <CardLabel
                          className="profile-label-margin"
                          style={editScreen ? { color: "#B1B4B6", width: "300px" } : { width: "300px" }}
                        >{`${t("CORE_COMMON_PROFILE_CONFIRM_PASSWORD")}`}</CardLabel>
                        <div style={{ width: "100%" }}>
                          <TextInput
                            t={t}
                            type={"password"}
                            isMandatory={false}
                            name="name"
                            pattern={
                              mdmsValidationData?.UserProfileValidationConfig?.[0]?.password ||
                              defaultValidationConfig?.UserProfileValidationConfig?.[0]?.password
                            }
                            onChange={(e) => setUserConfirmPassword(e?.target?.value)}
                            disabled={editScreen}
                          />
                          {errors?.confirmPassword && (
                            <ErrorMessage
                              message={t(errors?.confirmPassword?.message)}
                              truncateMessage={true}
                              maxLength={256}
                              className=""
                              wrapperClassName=""
                              showIcon={true}
                            />
                          )}
                        </div>
                      </LabelFieldPair>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </LabelFieldPair>
              {userType === "employee" && isMobile ? (
                <button
                  onClick={updateProfile}
                  style={{
                    marginTop: "24px",
                    backgroundColor: "#c84c0e",
                    width: "100%",
                    height: "40px",
                    color: "white",
                    maxWidth: isMobile ? "100%" : "240px",
                    borderBottom: "1px solid black",
                    fontWeight: "700",
                    fontSize: "17px",
                  }}
                >
                  {t("CORE_COMMON_SAVE")}
                </button>
              ) : null}
            </React.Fragment>
          )}
        </section>
      </div>

      {userType === "employee" && !isMobile ? (
        <Footer actionFields={[<SubmitBar t={t} label={t("CORE_COMMON_SAVE")} onSubmit={updateProfile} />]} className="" setactionFieldsToRight />
      ) : null}
      {toast && (
        <Toast
          type={toast.key}
          label={t(toast.key === "success" ? `CORE_COMMON_PROFILE_UPDATE_SUCCESS` : toast.action)}
          onClose={() => setToast(null)}
          style={{ maxWidth: "670px" }}
        />
      )}

      {openUploadSlide == true ? (
        <UploadDrawer
          setProfilePic={setFileStoreId}
          closeDrawer={closeFileUploadDrawer}
          userType={userType}
          removeProfilePic={removeProfilePic}
          showToast={showToast}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default UserProfile;