import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import { Button, CardText, FormComposerV2, PopUp, TextBlock } from "@egovernments/digit-ui-components";
import { newConfig } from "../configs/IndividualCreateConfig";
import { transformCreateData } from "../utils/createUtils";

const ValidateOTP = ({formData,onSuccess}) => {
  const { id } = useParams();
  const tenantId = Digit.ULBService.getStateId();
  const { t } = useTranslation();
  const history = useHistory();
  const reqCreate = {
    url: `/individual/v1/_create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };
console.log(formData,'formData');

  // user-otp/v1/_send?tenantId=pg

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);
  const onError = (resp) => {
    history.push(`/${window.contextPath}/individual/enroll-response?isSuccess=${false}`, { message: "SUBMISSION_CREATION_FAILED" });
  };

  const onSuccessMutat = (resp) => {
    history.push(`/${window.contextPath}/individual/enroll-response?appNo=${"NEW-NO-1"}&isSuccess=${true}`, {
      message: "SUBMISSION_CREATION_SUCCESS",
      showID: true,
      label: "SUBMISSION_ID",
    });
  };
  const onSubmit = async (data) => {
    console.log(data, "data");
    await mutation.mutate(
      {
        url: `/individual/v1/_create`,
        params: { tenantId },
        body: transformCreateData(data),
        config: {
          enable: true,
        },
      },
      {
        onSuccessMutat,
        onError,
      }
    );
  };
  return (
    <div className="enroll-popup">
      <PopUp
        heading={"Validate OTP"}
        description="A SMS to validate the user mobile number has been sent"
        children={[
          <div>
            <CardText style={{ margin: 0 }}>{t("SMS Sent to ") + formData?.mobileNumber}</CardText>
          </div>,
        ]}
        footerChildren={[
          <Button
            className={"campaign-type-alert-button"}
            type={"button"}
            size={"medium"}
            variation={"secondary"}
            label={t("Cancel")}
            onClick={() => {
                onSuccess(false);
              // setShowPopUp(false);
              // setCanUpdate(true);
            }}
          />,
          <Button
            className={"campaign-type-alert-button"}
            type={"button"}
            size={"medium"}
            variation={"primary"}
            label={t("Submit")}
            onClick={() => {
                onSuccess();
              // setShowPopUp(false);
              // setCanUpdate(false);
            }}
          />,
        ]}
      />
    </div>
  );
};

export default ValidateOTP;
