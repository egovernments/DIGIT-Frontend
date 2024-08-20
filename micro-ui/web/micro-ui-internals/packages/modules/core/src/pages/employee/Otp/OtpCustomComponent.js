import React, { Fragment, useState } from "react";
import { CardText, CardLabelError, Toast } from "@egovernments/digit-ui-components";
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

  const resendOtp = async () => {
    const data = { mobileNumber: params.mobileNumber };
    console.log("Resending OTP with data:", data);
    setTimeLeft(30);
    // Add actual resend OTP logic here
  };

  return (
    <>
      <OTPInput length={6} onChange={handleOtpChange} value={params?.otp} />
      {timeLeft > 0 ? (
        <CardText>{`${t("CS_RESEND_ANOTHER_OTP")} ${timeLeft} ${t("CS_RESEND_SECONDS")}`}</CardText>
      ) : (
        <p className="card-text-button" onClick={resendOtp}>
          {t("CS_RESEND_OTP")}
        </p>
      )}
      {!isOtpValid && <CardLabelError>{t("CS_INVALID_OTP")}</CardLabelError>}
    </>
  );
};

export default OtpComponent;
