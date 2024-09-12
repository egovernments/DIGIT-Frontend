import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import { FormComposerV2, TextBlock } from "@egovernments/digit-ui-components";
import { newConfig } from "../configs/IndividualCreateConfig";
import { transformCreateData } from "../utils/createUtils";
import ValidateOTP from "./ValidateOTP";

const IndividualCreate = () => {
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
  const [showPopup, setShowPopUp] = React.useState(false);
  const [formData, setFormData] = React.useState({});

  // user-otp/v1/_send?tenantId=pg

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);
  const onError = (resp) => {
    history.push(`/${window.contextPath}/individual/enroll-response?isSuccess=${false}`, { message: "SUBMISSION_CREATION_FAILED" });
  };

  const onSuccess = (resp) => {
    history.push(`/${window.contextPath}/individual/enroll-response?appNo=${"NEW-NO-1"}&isSuccess=${true}`, {
      message: "SUBMISSION_CREATION_SUCCESS",
      showID: true,
      label: "SUBMISSION_ID",
    });
  };
  const createIndividual = async () => {
    await mutation.mutate(
      {
        url: `/individual/v1/_create`,
        params: { tenantId },
        body: transformCreateData(formData),
        config: {
          enable: true,
        },
      },
      {
        onSuccess,
        onError,
      }
    );
  };
  const onSubmit = async (data) => {
    console.log(data, "data");
    setFormData(data);
    setShowPopUp(true);
  };
  return (
    <div className="enroll">
      <TextBlock
        caption=""
        captionClassName=""
        header="Apply"
        headerClasName=""
        subHeader={`Fill all the details to Apply for the scheme ${id}`}
        subHeaderClasName=""
        body=""
        bodyClasName=""
      ></TextBlock>
      <FormComposerV2
        label={t("Apply")}
        config={newConfig.map((config) => {
          return {
            ...config,
          };
        })}
        defaultValues={{}}
        onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
          console.log(formData, "formData");
        }}
        onSubmit={(data) => onSubmit(data)}
        fieldStyle={{ marginRight: 0 }}
      />
      {showPopup && (
        <ValidateOTP
          formData={formData}
          onSuccess={(succeded = true) => {
            setShowPopUp(false);
            succeded && createIndividual();
          }}
        ></ValidateOTP>
      )}
    </div>
  );
};

export default IndividualCreate;
