import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2, Header } from "@egovernments/digit-ui-react-components";
import { estimateConfig } from "../../configs/EstimateConfig";
import { transformCreateData } from "../../utils/createUtils";
import { transformEstimateData } from "../../utils/transformEstimateData";

const CreateEstimate = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const reqCreate = {
    url: `/mdms-v2/v2/_create/digitAssignment.estimate`,
    params: {},
    body: {},
    config: {
      enable: false,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const onSubmit = async (data) => {
    console.log(data, "data");
    console.log("transformed", transformEstimateData(data));
    await mutation.mutate({
      url: `/mdms-v2/v2/_create/digitAssignment.estimate`,
      body: transformEstimateData(data),
      config: {
        enable: true,
      },
    });
  };
  return (
    <div>
      <Header> {t("CREATE ESTIMATE")}</Header>
      <FormComposerV2
        label={t("SUBMIT_BUTTON")}
        config={estimateConfig.map((config) => {
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
    </div>
  );
};

export default CreateEstimate;
