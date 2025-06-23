import { BackLink, Loader, FormComposerV2, Toast, useCustomAPIMutationHook } from "@egovernments/digit-ui-components";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Background from "../../../components/Background";
import SandBoxHeader from "../../../components/SandBoxHeader";
import ImageComponent from "../../../components/ImageComponent";
import Carousel from "../SignUp-v2/CarouselComponent/CarouselComponent";
const Login = ({ config: propsConfig, t, isDisabled }) => {
  const { data: cities, isLoading } = Digit.Hooks.useTenants();
  const { data: storeData, isLoading: isStoreLoading } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const [showToast, setShowToast] = useState(null);
  const [disable, setDisable] = useState(false);

  const history = useHistory();

  function buildOtpUrl(contextPath, tenantId) {
    const ctx = (contextPath || "").split("/").filter(Boolean).join("/");
    if (ctx.includes("/")) {
      // already has at least one '/', so just use contextPath
      return `/${ctx}/employee/user/login/otp`;
    } else {
      // no '/', so append tenantId 
      return `/${ctx}/${tenantId}/employee/user/login/otp`;
    }
  }


  const reqCreate = {
    url: `/user-otp/v1/_send`,
    params: { tenantId: Digit?.ULBService?.getStateId() },
    body: {},
    config: {
      enable: false,
    },
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const onLogin = async (data) => {
    console.log(`*** LOG ***`, data);
    const inputEmail = data.email;
    const tenantId = data.accountName;
    await mutation.mutate(
      {
        params: {
          tenantId: tenantId,
        },
        body: {
          otp: {
            userName: data.email,
            type: "login",
            tenantId: tenantId,
            userType: "EMPLOYEE",
          },
        },
        config: {
          enable: true,
        },
      },
      {
        onError: (error, variables) => {
          setShowToast(
            {
              key: "error",
              label: error?.response?.data?.error?.message
            }
          );
          setTimeout(closeToast, 5000);
        },
        onSuccess: async (data) => {

          sessionStorage.setItem('otpEmail', inputEmail);
          sessionStorage.setItem('otpTenant', tenantId);
          const url = buildOtpUrl(window?.contextPath, tenantId);
          window.location.replace(url);

        },
      }
    );
  };



  const closeToast = () => {
    setShowToast(null);
  };

  let config = [{ body: propsConfig?.inputs }];

  const { mode } = Digit.Hooks.useQueryParams();
  if (mode === "admin" && config?.[0]?.body?.[2]?.disable == false && config?.[0]?.body?.[2]?.populators?.defaultValue == undefined) {
    config[0].body[2].disable = true;
    config[0].body[2].isMandatory = false;
    config[0].body[2].populators.defaultValue = defaultValue;
  }

  const onFormValueChange = (setValue, formData, formState) => {
    // Extract keys from the config
    const keys = config[0].body.map((field) => field.key);

    const hasEmptyFields = keys.some((key) => {
      const value = formData[key];
      return value == null || value === "" || (key === "check" && value === false) || (key === "captcha" && value === false);
    });

    // Set disable based on the check
    setDisable(hasEmptyFields);
  };

  return isLoading || isStoreLoading ? (
    <Loader />
  ) :
    (
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Left Carousel Section */}
        <div style={{ width: "70%", position: "relative" }}>
          <Carousel bannerImages={propsConfig.bannerImages} />
        </div>

        {/* Right Form Section */}
        <div style={{
          width: "30%", backgroundColor: "#fff", padding: "2rem", overflowY: "auto",
          justifyContent: "center", display: "flex", alignItems: "center"
        }}>
          <div className="employeeBackbuttonAlign">
            <BackLink onClick={() => window.history.back()} />
          </div>
          <FormComposerV2
            onSubmit={onLogin}
            isDisabled={isDisabled || disable}
            noBoxShadow
            inline
            submitInForm
            config={config}
            label={propsConfig?.texts?.submitButtonLabel}
            secondaryActionLabel={propsConfig?.texts?.secondaryButtonLabel}
            onFormValueChange={onFormValueChange}
            heading={propsConfig?.texts?.header}
            className="sandbox-signup-form"
            cardClassName="sandbox-onboarding-wrapper"
          >
            <SandBoxHeader showTenant={false} />
          </FormComposerV2>
          {showToast && <Toast type="error" label={t(showToast?.label)} onClose={closeToast} />}
          <div className="employee-login-home-footer" style={{ backgroundColor: "unset" }}>
            <ImageComponent
              alt="Powered by DIGIT"
              src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER_BW")}
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
              }}
            />
          </div>
        </div>
      </div>
    );
};

Login.propTypes = {
  loginParams: PropTypes.any,
};

Login.defaultProps = {
  loginParams: null,
};

export default Login;
