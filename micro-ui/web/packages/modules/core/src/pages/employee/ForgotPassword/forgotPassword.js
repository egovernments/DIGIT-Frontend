// import { FormComposer } from "@egovernments/digit-ui-react-components";
import { BackLink, Dropdown, Loader, Toast, FormComposerV2 } from "@egovernments/digit-ui-components";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../../../components/Background";
import Header from "../../../components/Header";
import ImageComponent from "../../../components/ImageComponent";
import Carousel from "../Login/Carousel/Carousel";
import { useLoginConfig } from "../../../hooks/useLoginConfig";

const ForgotPassword = ({ config: propsConfig, t, stateCode }) => {
  const { data: cities, isLoading } = Digit.Hooks.useTenants();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(null);
  const getUserType = () => Digit.UserService.getType();
  
  const { data : mdmsData } = useLoginConfig(stateCode);
  
  if(mdmsData?.config){
    const bannerImages = mdmsData?.config[0]?.bannerImages;
    propsConfig.bannerImages = bannerImages;
  }

  useEffect(() => {
    if (!user) {
      Digit.UserService.setType("employee");
      return;
    }
    Digit.UserService.setUser(user);
    const redirectPath = location.state?.from || `/${window?.contextPath}/employee`;
    navigate(redirectPath, {replace:true});
  }, [user]);

  const closeToast = () => {
    setShowToast(null);
  };

  const onForgotPassword = async (data) => {
    if (!data.city) {
      alert("Please Select City!");
      return;
    }
    const requestData = {
      otp: {
        userName: data.username,
        userType: getUserType().toUpperCase(),
        type: "passwordreset",
        tenantId: data.city.code,
      },
    };
    try {
      await Digit.UserService.sendOtp(requestData, data.city.code);
      navigate(`/${window?.contextPath}/employee/user/change-password?USERNAME=${data.username}&tenantId=${data.city.code}`);
    } catch (err) {
      setShowToast(err?.response?.data?.error?.fields?.[0]?.message || "Invalid login credentials!");
      setTimeout(closeToast, 5000);
    }
  };

  const navigateToLogin = () => {
    navigate(`/${window?.contextPath}/employee/login`);
  };

  const [userId, city] = propsConfig.inputs;
  const config = [
    {
      body: [
        {
          label: t("USERNAME"),
          type: "text",
          populators: {
            name: "username",
          },
          isMandatory: true,
        },
        {
          label: t(city.label),
          type: city.type,
          populators: {
            name: city.name,
            optionsKey: "name",
            required: true,
            options: cities,
          },
          isMandatory: true,
        },
      ],
    },
  ];

  if (isLoading) {
    return  <Loader page={true} variant="PageLoader" />
  }

  return (
    propsConfig?.bannerImages ? (
      <React.Fragment>
        <div className="login-container">
          <Carousel  bannerImages={propsConfig?.bannerImages} />
          <div className="login-form-container">
            <FormComposerV2
              onSubmit={onForgotPassword}
              noBoxShadow
              inline
              submitInForm
              config={config}
              label={propsConfig.texts.submitButtonLabel}
              secondaryActionLabel={propsConfig.texts.secondaryButtonLabel}
              onSecondayActionClick={navigateToLogin}
              heading={propsConfig.texts.header}
              description={propsConfig.texts.description}
              headingStyle={{ textAlign: "center", fontWeight: "bold", color: "#363636" }}
              descriptionStyles={{ color: "#787878", textAlign: "center" }}
              cardStyle={{ maxWidth: "408px", margin: "auto" }}
              className="employeeForgotPassword"
              secondaryActionId={"employeeForgotPassword"}
            >
              <Header />
            </FormComposerV2>
            {showToast && <Toast type={"error"} label={t(showToast)} onClose={closeToast} />}
            <div className="EmployeeLoginFooter">
              <ImageComponent
                alt="Powered by DIGIT"
                src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER_BW")}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
                }}
              />{" "}
            </div>
          </div>
        </div>
      </React.Fragment>
    ) :
      <Background>
        <div className="employeeBackbuttonAlign">
          <BackLink onClick={() => window.history.back()} />
        </div>
        <FormComposerV2
          onSubmit={onForgotPassword}
          noBoxShadow
          inline
          submitInForm
          config={config}
          label={propsConfig.texts.submitButtonLabel}
          secondaryActionLabel={propsConfig.texts.secondaryButtonLabel}
          onSecondayActionClick={navigateToLogin}
          heading={propsConfig.texts.header}
          description={propsConfig.texts.description}
          headingStyle={{ textAlign: "center", fontWeight: "bold", color: "#363636" }}
          descriptionStyles={{ color: "#787878", textAlign: "center" }}
          cardStyle={{ maxWidth: "408px", margin: "auto" }}
          className="employeeForgotPassword"
          secondaryActionId={"employeeForgotPassword"}
        >
          <Header />
        </FormComposerV2>
        {showToast && <Toast type={"error"} label={t(showToast)} onClose={closeToast} />}
        <div className="EmployeeLoginFooter">
          <ImageComponent
            alt="Powered by DIGIT"
            src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER_BW")}
            style={{ cursor: "pointer" }}
            onClick={() => {
              window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
            }}
          />{" "}
        </div>
      </Background>
  );
};

ForgotPassword.propTypes = {
  loginParams: PropTypes.any,
};

ForgotPassword.defaultProps = {
  loginParams: null,
};

export default ForgotPassword;