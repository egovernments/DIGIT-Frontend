import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2, Header } from "@egovernments/digit-ui-react-components";
import { configs } from "../../configs/ordersCreateConfig";
import { transformCreateData } from "../../utils/createUtils";

const fieldStyle={ marginRight: 0 };

const MakeSubmission = () => {
  const defaultValue={};
  const tenantId = Digit.ULBService.getCurrentTenantId();
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

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const onSubmit = async(data) => {
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
    );
  };
  return (
    <div>
      <Header> {t("CREATE_INDIVIDUAL")}</Header>
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

export default MakeSubmission;