// import { FormComposer } from "@egovernments/digit-ui-react-components";
import { BackLink, Dropdown, Loader,Toast,FormComposerV2 } from "@egovernments/digit-ui-components";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Background from "../../../components/Background";
import Header from "../../../components/Header";


const ForgotPassword = ({ config: propsConfig, t }) => {
  const { data: cities, isLoading } = Digit.Hooks.useTenants();
  const [user, setUser] = useState(null);
  const history = useHistory();
  const [showToast, setShowToast] = useState(null);
  const getUserType = () => Digit.UserService.getType();

  useEffect(() => {
    if (!user) {
      Digit.UserService.setType("employee");
      return;
    }
    Digit.UserService.setUser(user);
    const redirectPath = location.state?.from || `/${window?.contextPath}/employee`;
    history.replace(redirectPath);
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
        mobileNumber: data.mobileNumber,
        userType: getUserType().toUpperCase(),
        type: "passwordreset",
        tenantId: data.city.code,
      },
    };
    try {
      await Digit.UserService.sendOtp(requestData, data.city.code);
      history.push(`/${window?.contextPath}/employee/user/change-password?mobile_number=${data.mobileNumber}&tenantId=${data.city.code}`);
    } catch (err) {
      setShowToast(err?.response?.data?.error?.fields?.[0]?.message || "Invalid login credentials!");
      setTimeout(closeToast, 5000);
    }
  };

  const navigateToLogin = () => {
    history.replace(`/${window?.contextPath}/employee/login`);
  };

  const [userId, city] = propsConfig.inputs;
  const config = [
    {
      body: [
        {
          label: t(userId.label),
          type: userId.type,
          populators: {
            name: userId.name,
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
    return <Loader />;
  }

  return (
    <Background>
      <div className="employeeBackbuttonAlign">
      <BackLink onClick={() => window.history.back()}/>
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
        headingStyle={{ textAlign: "center",fontWeight:"bold",color:"#363636" }}
        descriptionStyles={{color:"#787878",textAlign: "center"}}
        cardStyle={{ maxWidth: "408px", margin: "auto" }}
        className="employeeForgotPassword"
      >
        <Header />
      </FormComposerV2>
      {showToast && <Toast type={"error"} label={t(showToast)} onClose={closeToast} />}
      <div className="EmployeeLoginFooter">
        <img
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
