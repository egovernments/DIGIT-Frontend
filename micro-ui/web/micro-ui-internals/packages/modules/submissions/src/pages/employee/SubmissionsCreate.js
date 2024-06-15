import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2, Header } from "@egovernments/digit-ui-react-components";
import { configs } from "../../configs/submissionsCreateConfig";
import { transformCreateData } from "../../utils/createUtils";

const fieldStyle={ marginRight: 0 };

const SubmissionsCreate = () => {
  const defaultValue={};
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const reqCreate = {
    url: `/application/application/v1/create`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);
  const onError = (resp) => {
    history.push(`/${window.contextPath}/employee/submissions/submissions-response?isSuccess=${false}`, { message: "SUBMISSION_CREATION_FAILED" });
  };

  const onSuccess = (resp) => {
    history.push(`/${window.contextPath}/employee/submissions/submissions-response?appNo=${"NEW-NO-1"}&isSuccess=${true}`, {
      message:  "SUBMISSION_CREATION_SUCCESS",
      showID: true,
      label: "SUBMISSION_ID",
    });
  };
  const onSubmit = async(data) => {
    console.log(data, "data");
    await mutation.mutate(
      {
        url: `application/application/v1/create`,
        params: { tenantId },
        body: transformCreateData(data),
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
  return (
    <div>
      <Header> {t("CREATE_SUBMISSION")}</Header>
       <FormComposerV2
        label={t("SUBMIT_BUTTON")}
        config={configs.map((config) => {
          return {
            ...config,
          };
        })}
        defaultValues={defaultValue}
        onFormValueChange ={ (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
          console.log(formData, "formData");
        }}
        onSubmit={(data,) => onSubmit(data, )}
        fieldStyle={fieldStyle}
      /> 
       
    </div>
  );
}

export default SubmissionsCreate;