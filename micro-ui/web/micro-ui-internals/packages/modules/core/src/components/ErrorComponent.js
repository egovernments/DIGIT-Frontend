import React from "react";
import { useTranslation } from "react-i18next";

const ErrorConfig = {
  error: {
    imgUrl: `https://s3.ap-south-1.amazonaws.com/egov-qa-assets/error-image.png`,
    infoMessage: "CORE_SOMETHING_WENT_WRONG",
    buttonInfo: "ACTION_TEST_HOME",
  },
  maintenance: {
    imgUrl: `https://s3.ap-south-1.amazonaws.com/egov-qa-assets/maintainence-image.png`,
    infoMessage: "CORE_UNDER_MAINTENANCE",
    buttonInfo: "ACTION_TEST_HOME",
  },
  notfound: {
    imgUrl: `https://s3.ap-south-1.amazonaws.com/egov-qa-assets/PageNotFound.png`,
    infoMessage: "MODULE_NOT_FOUND",
    buttonInfo: "ACTION_TEST_HOME",
  },
};

const ModuleBasedErrorConfig = {
  sandbox: {
    imgUrl: `https://s3.ap-south-1.amazonaws.com/egov-qa-assets/error-image.png`,
    infoMessage: "WRONG_TENANT_SIGN_UP",
    buttonInfo: "CREATE_TENANT_ERROR_BUTTON",
  },
};

const ErrorComponent = (props) => {
  const { type = "error" } = Digit.Hooks.useQueryParams();
  const module = props?.errorData?.module;
  const { t } = useTranslation();
  const config = module ? ModuleBasedErrorConfig[module] : ErrorConfig[type];
  const stateInfo = props.stateInfo;

  return (
    <div className="error-boundary">
      <div className="error-container">
        <img src={config.imgUrl} alt="error" />
        <h1>{t(config.infoMessage)}</h1>
        <button
          onClick={() => {
            module ? props?.errorData?.action() : props.goToHome();
          }}
        >
          {t(config.buttonInfo)}
        </button>
      </div>
    </div>
  );
};

export default ErrorComponent;
