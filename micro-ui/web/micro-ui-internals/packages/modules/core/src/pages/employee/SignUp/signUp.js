import { BackLink, Loader, FormComposerV2, Toast, useCustomAPIMutationHook } from "@egovernments/digit-ui-components";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Background from "../../../components/Background";
import Header from "../../../components/Header";
import ImageComponent from "../../../components/ImageComponent";
const Login = ({ config: propsConfig, t, isDisabled }) => {
  const { data: cities, isLoading } = Digit.Hooks.useTenants();
  const { data: storeData, isLoading: isStoreLoading } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const [showToast, setShowToast] = useState(null);
  const [disable, setDisable] = useState(false);

  const history = useHistory();

  const reqCreate = {
    url: `/tenant-management/tenant/_create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const onLogin = async (data) => {
    await mutation.mutate(
      {
        body: {
          tenant: {
            name: data.accountName,
            email: data.email,
          },
        },
        config: {
          enable: true,
        },
      },
      {
        onError: (error, variables) => {
          setShowToast({
            key: "error",
            label: error?.response?.data?.Errors?.[0]?.code ? `SANDBOX_SIGNUP_${error?.response?.data?.Errors?.[0]?.code}` : `SANDBOX_SIGNUP_ERROR`,
          });
        },
        onSuccess: async (data) => {
          history.push({
            pathname: `/${window?.globalPath}/user/otp`,
            state: { email: data?.Tenants[0]?.email, tenant: data?.Tenants[0]?.code },
          });
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
  ) : (
    <Background>
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
        cardSubHeaderClassName="signupCardSubHeaderClassName"
        cardClassName="signupCardClassName sandbox-onboarding-wrapper"
        buttonClassName="buttonClassName"
      >
        <Header showTenant={false} />
      </FormComposerV2>
      {showToast && <Toast type={"error"} label={t(showToast?.label)} onClose={closeToast} />}
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
    </Background>
  );
};

Login.propTypes = {
  loginParams: PropTypes.any,
};

Login.defaultProps = {
  loginParams: null,
};

export default Login;
