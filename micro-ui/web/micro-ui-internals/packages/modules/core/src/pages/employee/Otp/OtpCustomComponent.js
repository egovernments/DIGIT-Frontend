import React, { Fragment, useState } from "react";
import { CardText, CardLabelError, Toast, CardLabel } from "@egovernments/digit-ui-components";
import { OTPInput } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory, useLocation } from "react-router-dom";
import useInterval from "../../../hooks/useInterval";
import Background from "../../../components/Background";
import { useEffect } from "react";

const OtpComponent = ({ onSelect, formData, control, formState, ...props }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [showToast, setShowToast] = useState(null);
  const [params, setParams] = useState({});
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);

  const closeToast = () => {
    setShowToast(null);
  };

  useInterval(
    () => {
      setTimeLeft(timeLeft - 1);
    },
    timeLeft > 0 ? 1000 : null
  );

  const handleOtpChange = (otp) => {
    setParams({ ...params, otp });
  };

  useEffect(() => {
    onSelect("OtpComponent", params);
  }, [params]);

  const reqCreate = {
    url: `/user-otp/v1/_send`,
    params: { tenantId: props?.props?.code },
    body: {},
    config: {
      enable: false,
    },
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const resendOtp = async () => {
    setTimeLeft(30);
    await mutation.mutate(
      {
        body: {
        "otp": {
        "userName": props?.props?.email,
        "type": "login",
        "tenantId": props?.props?.tenant,
        "userType": "EMPLOYEE"
        }
        },
        config: {
          enable: true,
        },
      },
      {
        onError: (error, variables) => {
          setShowToast({
            key: "error",
            label: error?.response?.data?.Errors?.[0].code
              ? `SANDBOX_RESEND_OTP${error?.response?.data?.Errors?.[0]?.code}`
              : `SANDBOX_RESEND_OTP_ERROR`,
          });
          setTimeout(closeToast, 5000);
        },
        onSuccess: async (data) => {
          setShowToast({ key: "info", label: t("OTP_RESNED_SUCCESFULL") });
          setTimeout(closeToast, 5000);
        },
      }
    );
  };

  return (
    <>
    <CardLabel className={"sandbox-custom-otp-subheader"}>{t("SANDBOX_ENTER_OTP")}</CardLabel>
    <CardLabel className={"sandbox-custom-otp-header"} >{t("CS_OTP_EMAIL")}</CardLabel>
    <CardLabel className={"sandbox-custom-otp-email"} style={{fontWeight: 'bold'}}>{props?.props?.email}</CardLabel>
      <OTPInput className={"sandbox-otp-input"} length={6} onChange={handleOtpChange} value={params?.otp} />
      {timeLeft > 0 ? (
        <CardText className={"sandbox-resend-otp"}>{`${t("CS_RESEND_ANOTHER_OTP")} ${timeLeft} ${t("CS_RESEND_SECONDS")}`}</CardText>
      ) : (
        <p className="card-text-button sandbox-otp-input" onClick={resendOtp}>
          {t("CS_RESEND_OTP")}
        </p>
      )}
      {!isOtpValid && <CardLabelError>{t("CS_INVALID_OTP")}</CardLabelError>}
      {showToast && <Toast type={showToast?.key} label={t(showToast?.label)} onClose={closeToast} />}
    </>
  );
};

export default OtpComponent;
